import { readonly, ref } from 'vue'

const points = ref(1280)
const pendingAccountTransaction = ref(null)
const lastDailyLoginRewardDate = ref(null)
let nextTransactionId = 1

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function usePoints() {
  function applyPointTransaction(type, amount) {
    const normalizedAmount = Number(amount)
    if (!Number.isFinite(normalizedAmount) || normalizedAmount === 0) return null

    const transaction = {
      id: nextTransactionId,
      type,
      amount: normalizedAmount,
      previousBalance: points.value,
      balance: points.value + normalizedAmount,
    }

    nextTransactionId += 1
    points.value = transaction.balance
    pendingAccountTransaction.value = transaction
    return transaction
  }

  function awardDailyLogin(amount = 5) {
    const todayKey = formatDateKey(new Date())
    if (lastDailyLoginRewardDate.value === todayKey) return null

    lastDailyLoginRewardDate.value = todayKey
    return applyPointTransaction('daily-login', Math.abs(amount))
  }

  function consumePendingAccountTransaction() {
    const transaction = pendingAccountTransaction.value
    pendingAccountTransaction.value = null
    return transaction
  }

  return {
    points: readonly(points),
    applyPointTransaction,
    awardDailyLogin,
    consumePendingAccountTransaction,
  }
}
