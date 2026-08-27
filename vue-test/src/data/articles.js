const articleSeeds = Object.freeze([
  {
    id: 'official',
    label: '官方公告',
    icon: '#icon-megaphone',
    tone: 'official',
    image:
      'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&w=900&q=84',
    titles: ['PawPuff 平台新版上線公告！', '夏季毛孩活動報名開始', '社群守則更新與使用提醒'],
    likes: [198, 224, 176],
  },
  {
    id: 'food',
    label: '飲食營養',
    icon: '#icon-food-bowl',
    tone: 'food',
    image:
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=84',
    titles: ['自製狗狗鮮食的 5 個營養搭配技巧', '貓咪不愛喝水？5 招提升飲水量', '換飼料前應該知道的漸進原則'],
    likes: [274, 153, 209],
  },
  {
    id: 'training',
    label: '行為訓練',
    icon: '#icon-training-bone',
    tone: 'training',
    image:
      'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=900&q=84',
    titles: ['教會狗狗「握手」的 3 個簡單步驟', '改善狗狗亂咬東西的實用訓練方法', '讓毛孩習慣獨處的日常練習'],
    likes: [259, 176, 231],
  },
  {
    id: 'adoption',
    label: '寵物領養',
    icon: '#icon-heart-outline',
    tone: 'adoption',
    image:
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=84',
    titles: ['可愛虎斑貓找家！親人愛撒嬌的小男生', '領養前先準備：新手家庭檢查清單', '陪伴中途毛孩適應新家的方法'],
    likes: [212, 186, 244],
  },
  {
    id: 'rescue',
    label: '走失求助',
    icon: '#icon-location-alert',
    tone: 'rescue',
    image:
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=84',
    titles: ['毛孩走失怎麼辦？快速找回的 4 個步驟', '協尋資訊怎麼寫才容易被看見', '外出散步防走失的必備用品'],
    likes: [118, 165, 194],
  },
  {
    id: 'care',
    label: '醫療養護',
    icon: '#icon-medical-cross',
    tone: 'care',
    image:
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=84',
    titles: ['毛孩定期健康檢查的重要性', '狗狗夏季中暑預防與急救指南', '高齡毛孩居家照護的注意事項'],
    likes: [256, 382, 218],
  },
  {
    id: 'beauty',
    label: '美容美體',
    icon: '#icon-scissors',
    tone: 'beauty',
    image:
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=900&q=84',
    titles: ['在家幫毛孩美容的 5 個小技巧', '不同毛質的梳毛工具怎麼選', '幫毛孩洗澡時容易忽略的細節'],
    likes: [123, 169, 201],
  },
])

export const articleCategories = Object.freeze(
  articleSeeds.map(({ id, label, icon }) => ({ id, label, icon })),
)

export const articleCatalog = Object.freeze(
  Array.from({ length: 3 }, (_, roundIndex) =>
    articleSeeds.map((seed, categoryIndex) => ({
      id: `${seed.id}-${roundIndex + 1}`,
      categoryId: seed.id,
      category: seed.label,
      tone: seed.tone,
      title: seed.titles[roundIndex],
      likes: seed.likes[roundIndex],
      image: `${seed.image}&sig=${categoryIndex + roundIndex * articleSeeds.length + 1}`,
    })),
  ).flat(),
)
