import { decodeJwt } from "jose"
import { cookies } from "next/headers";
import { AccountTokenPayload } from "../auth/jwt";
import { createServiceRoleClient } from "../supabase/server";

export async function getAccount() {
  const cookieList = await cookies();
  const payload = decodeJwt<AccountTokenPayload>(cookieList.get('account')!.value);
  return getAccountByid(payload.id);
}

export async function getAccountByid(id: string) {
  const supabase = await createServiceRoleClient();
  const { data } = await supabase.from('accounts').select().match({ id }).maybeSingle();
  return data;
}

export async function getAccountByDomainIdentifier(domainIdentifier: string, isCustomDomain: boolean) {
  console.log(isCustomDomain);
  const supabase = await createServiceRoleClient();
  const { data } = await supabase.from('accounts').select().match({ domain_identifier: domainIdentifier }).maybeSingle();
  return data;
}