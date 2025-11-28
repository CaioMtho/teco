'use client'
import Link from 'next/link'
import { supabase } from 'lib/supabase/client'

const { data: { user } } = await supabase.auth.getUser();

export default function EntrarButton() {
  if(user?.aud != "authenticated"){
    return (
      <Link href="/login" className="inline-block w-auto p-3 py-2 self-center ms-auto text-black font-medium transition-colors 
          bg-white border rounded-md hover:bg-gray-100 ">entrar
          
      </Link>

  )}else{
    return (
      <div></div>
    )
  }
}