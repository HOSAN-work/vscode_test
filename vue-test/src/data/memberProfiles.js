const baseMemberProfiles = [
  {
    id: 1,
    nickname: '噗噗麻',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=720&q=88',
    introduction: '毛孩是我生活的陽光！喜歡分享日常、訓練心得與各種實用小知識，希望能和大家一起讓毛孩快樂健康地長大。',
  },
  {
    id: 2,
    nickname: '貪睡橘貓 3046',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=720&q=84',
  },
  {
    id: 3,
    nickname: '活潑柯基 8892',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=720&q=84',
  },
  {
    id: 4,
    nickname: '可愛兔兔 1357',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=720&q=84',
  },
  {
    id: 5,
    nickname: '奶油貴賓 5218',
    image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=720&q=84',
  },
  {
    id: 6,
    nickname: '午後虎斑 6630',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=720&q=84',
  },
  {
    id: 7,
    nickname: '元氣米克斯 4075',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=720&q=84',
  },
  {
    id: 8,
    nickname: '溫柔黃金 9124',
    image: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=720&q=84',
  },
]

const followerAdjectives = ['晨光', '療癒', '好奇', '悠遊']
const generatedMemberProfiles = Array.from({ length: 16 }, (_, index) => {
  const source = baseMemberProfiles[(index % (baseMemberProfiles.length - 1)) + 1]
  const id = index + 9
  return {
    id,
    nickname: `${followerAdjectives[index % followerAdjectives.length]}${source.nickname.split(' ')[0]} ${String(2100 + index * 173).slice(-4)}`,
    image: source.image,
    introduction: '喜歡在 PawPuff 收藏毛孩生活、交換照顧心得，也期待認識更多溫暖的毛孩夥伴。',
  }
})

export const memberProfiles = Object.freeze([
  ...baseMemberProfiles.map((member) => ({
    ...member,
    introduction:
      member.introduction ??
      '喜歡記錄毛孩的可愛日常，也會分享散步、飲食與陪伴生活中的小故事。',
  })),
  ...generatedMemberProfiles,
])

export function getMemberProfile(userId) {
  const normalizedId = Number.parseInt(userId, 10)
  const matchedMember = memberProfiles.find((member) => member.id === normalizedId)
  if (matchedMember) return matchedMember

  const fallbackImage = memberProfiles[Math.abs(normalizedId || 1) % memberProfiles.length].image
  return {
    id: normalizedId || 1,
    nickname: `PawPuff 會員 ${normalizedId || 1}`,
    image: fallbackImage,
    introduction: '這位會員正在 PawPuff 與大家分享毛孩生活。',
  }
}
