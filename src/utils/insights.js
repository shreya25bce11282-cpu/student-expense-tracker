export function generateInsights(state, catTotals, totalExpenses, savings, forecast) {
  const insights = [];
  const { categoryBudgets, totalBudget, income, savingsGoal } = state;
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dayOfMonth = today.getDate();
  const daysLeft = daysInMonth - dayOfMonth;
  const avgDailySpend = totalExpenses / dayOfMonth;

  Object.entries(categoryBudgets).forEach(([cat, budget]) => {
    const spent = catTotals[cat] || 0;
    const pct = Math.round((spent / budget) * 100);
    if (pct > 0) {
      insights.push({
        priority: pct > 80 ? 1 : 2,
        text: `You have spent ${pct}% of your ${cat} budget.`,
        type: pct > 80 ? 'danger' : pct > 60 ? 'warning' : 'info'
      });
    }
    if (daysLeft > 0 && avgDailySpend > 0) {
      const projectedSpent = spent + (avgDailySpend * daysLeft * (spent / (totalExpenses || 1)));
      if (projectedSpent > budget && spent < budget) {
        const daysToExceed = Math.round((budget - spent) / (avgDailySpend * (spent / (totalExpenses || 1))));
        if (daysToExceed > 0 && daysToExceed <= daysLeft) {
          insights.push({
            priority: 1,
            text: `At your current spending rate, you may exceed your ${cat} budget in ${daysToExceed} days.`,
            type: 'warning'
          });
        }
      }
    }
  });

  if (savings >= savingsGoal) {
    insights.push({ priority: 2, text: `🎉 You've reached your savings goal of ₹${savingsGoal.toLocaleString()}!`, type: 'success' });
  } else if (savings > 0) {
    const pct = Math.round((savings / savingsGoal) * 100);
    insights.push({ priority: 3, text: `You're ${pct}% toward your ₹${savingsGoal.toLocaleString()} savings goal.`, type: 'info' });
  }

  const util = totalExpenses / totalBudget;
  if (util > 0.9) {
    insights.push({ priority: 1, text: `⚠️ You've used ${Math.round(util * 100)}% of your total budget.`, type: 'danger' });
  }

  insights.sort((a, b) => a.priority - b.priority);
  return insights;
}
