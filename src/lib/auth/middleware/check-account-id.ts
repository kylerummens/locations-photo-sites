import { NextRequest, NextResponse } from "next/server"
import { createSignedToken, verifyToken } from "../jwt";
import { getAccountByDomainIdentifier } from "@/lib/db/accounts";

export async function checkAccountId(request: NextRequest) {

  const { hostname } = request.nextUrl;
  const { domainIdentifier, isCustomDomain } = getDomainIdentifierFromHostname(hostname);
  const accountCookie = request.cookies.get('account')?.value;

  if (accountCookie) {
    const payload = await verifyToken(accountCookie);
    if (payload) {
      if (payload.domainIdentifier !== domainIdentifier) {
        console.debug('middleware -> account cookie is valid, but domain identifiers do not match', payload, domainIdentifier);
        return validateDomainIdentifier(request, domainIdentifier, isCustomDomain);
      }
    }
    else {
      console.debug('middleware -> account cookie is set but not valid, need to check');
      return validateDomainIdentifier(request, domainIdentifier, isCustomDomain);
    }
  }
  else {
    console.debug('middleware -> account cookie is missing, need to check');
    return validateDomainIdentifier(request, domainIdentifier, isCustomDomain);
  }
}


function getDomainIdentifierFromHostname(hostname: string) {
  const mainDomain = 'locations.photo';
  if (hostname.endsWith(mainDomain)) {
    return { domainIdentifier: hostname.split('.')[0], isCustomDomain: false };
  } else {
    return { domainIdentifier: hostname, isCustomDomain: true };
  }
}

async function validateDomainIdentifier(request: NextRequest, domainIdentifier: string, isCustomDomain: boolean) {
  const account = await getAccountByDomainIdentifier(domainIdentifier, isCustomDomain);

  if (!account) {
    const url = new URL('https://locations.photo/not-found');
    url.searchParams.set('domainIdentifier', domainIdentifier);
    return NextResponse.redirect(url);
  }
  else {
    // Sign the account ID as a JWT
    const signedAccountId = await createSignedToken(account);

    // Set the new signed JWT cookie
    const response = NextResponse.next();
    response.cookies.set('account', signedAccountId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;
  }
}

