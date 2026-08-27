import { reactive } from 'vue'
import { memberProfiles } from './memberProfiles'

const followingByMemberId = reactive({
  1: [2, 3, 4, 5, 14, 18],
  2: [1],
  3: [1],
  4: [1],
  5: [1],
  6: [1],
  7: [1],
  8: [1],
  9: [1],
  10: [1],
})

function normalizeMemberId(memberId) {
  return Number.parseInt(memberId, 10) || 0
}

export function getFollowingIds(memberId) {
  return [...(followingByMemberId[normalizeMemberId(memberId)] ?? [])]
}

export function isFollowingMember(sourceMemberId, targetMemberId) {
  const normalizedSourceId = normalizeMemberId(sourceMemberId)
  const normalizedTargetId = normalizeMemberId(targetMemberId)
  return getFollowingIds(normalizedSourceId).includes(normalizedTargetId)
}

export function followMember(sourceMemberId, targetMemberId) {
  const normalizedSourceId = normalizeMemberId(sourceMemberId)
  const normalizedTargetId = normalizeMemberId(targetMemberId)
  const targetExists = memberProfiles.some((member) => member.id === normalizedTargetId)

  if (
    !normalizedSourceId
    || !targetExists
    || normalizedSourceId === normalizedTargetId
    || isFollowingMember(normalizedSourceId, normalizedTargetId)
  ) return false

  followingByMemberId[normalizedSourceId] = [
    ...getFollowingIds(normalizedSourceId),
    normalizedTargetId,
  ]
  return true
}

export function unfollowMember(sourceMemberId, targetMemberId) {
  const normalizedSourceId = normalizeMemberId(sourceMemberId)
  const normalizedTargetId = normalizeMemberId(targetMemberId)

  if (!isFollowingMember(normalizedSourceId, normalizedTargetId)) return false

  followingByMemberId[normalizedSourceId] = getFollowingIds(normalizedSourceId)
    .filter((memberId) => memberId !== normalizedTargetId)
  return true
}

export function getFollowerIds(memberId) {
  const normalizedId = normalizeMemberId(memberId)
  return memberProfiles
    .filter((member) => getFollowingIds(member.id).includes(normalizedId))
    .map((member) => member.id)
}

export function getMutualFollowingIds(memberId) {
  const normalizedId = normalizeMemberId(memberId)
  const followingIds = getFollowingIds(normalizedId)
  const followerIds = new Set(getFollowerIds(normalizedId))
  return followingIds.filter((id) => followerIds.has(id))
}

export function getMembersByIds(memberIds) {
  const idSet = new Set(memberIds.map(normalizeMemberId))
  return memberProfiles.filter((member) => idSet.has(member.id))
}

export function getFollowerProfiles(memberId) {
  return getMembersByIds(getFollowerIds(memberId))
}

export function getFollowingProfiles(memberId) {
  return getMembersByIds(getFollowingIds(memberId))
}

export function getMutualFollowingProfiles(memberId) {
  return getMembersByIds(getMutualFollowingIds(memberId))
}
