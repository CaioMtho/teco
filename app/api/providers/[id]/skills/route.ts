import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { getProviderSkills, addSkillToProvider, removeSkillFromProvider, createOrGetSkill } from '@/../lib/services/provider-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const skills = await getProviderSkills(supabase, params.id)
    return NextResponse.json({ skills })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const body = await request.json()
    validateRequired(body, ['skill_name'])
    
    const skill = await createOrGetSkill(supabase, body.skill_name, body.category)
    
    const providerSkill = await addSkillToProvider(supabase, {
      provider_id: params.id,
      skill_id: skill.id,
      experience_years: body.experience_years
    })
    
    return NextResponse.json({ provider_skill: providerSkill }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const searchParams = request.nextUrl.searchParams
    const skillId = searchParams.get('skill_id')
    
    if (!skillId) {
      return NextResponse.json({ error: 'skill_id is required' }, { status: 400 })
    }
    
    await removeSkillFromProvider(supabase, params.id, skillId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error)
  }
}
