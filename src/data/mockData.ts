export const stateDiscomMap: Record<string, string[]> = {
  "Delhi": ["BSES Rajdhani", "BSES Yamuna", "Tata Power Delhi"],
  "Mumbai": ["Adani Electricity", "Tata Power Mumbai", "BEST"],
  "Gujarat": ["UGVCL", "DGVCL", "MGVCL", "PGVCL"],
  "UP": ["UPPCL", "DVVNL", "PVVNL"],
  "Kerala": ["KSEB"],
  "Telangana": ["TSSPDCL", "TSNPDCL"],
  "Bihar": ["SBPDCL", "NBPDCL"],
  "Rajasthan": ["JVVNL", "AVVNL", "JdVVNL"],
  "MP": ["MPMKVVCL", "MPPKVVCL"],
  "Maharashtra": ["MSEDCL", "Tata Power Maharashtra"],
};

export const states = Object.keys(stateDiscomMap);
export const discoms = Object.values(stateDiscomMap).flat();

export const mockUsers = [
  { id: "USR-001", consumerId: "CON-10001", name: "Rajesh Kumar", meterId: "MTR-10234", phone: "+91 98765 43210", email: "rajesh.kumar@email.com", billAmount: 2450, lastPayment: "2026-02-10", status: "Paid", region: "Delhi", state: "Delhi", discom: "BSES Rajdhani", active: true, activeComplaint: true, complaintId: "CMP-001", remainingBalance: 1200, balanceUsedByTime: { today: 80, lastWeek: 520, lastMonth: 2100, year: 24500 } },
  { id: "USR-002", consumerId: "CON-10002", name: "Priya Sharma", meterId: "MTR-10235", phone: "+91 98765 43211", email: "priya.sharma@email.com", billAmount: 3200, lastPayment: "2026-01-28", status: "Overdue", region: "Mumbai", state: "Mumbai", discom: "Adani Electricity", active: true, activeComplaint: false, complaintId: "", remainingBalance: 450, balanceUsedByTime: { today: 120, lastWeek: 780, lastMonth: 3100, year: 38000 } },
  { id: "USR-003", consumerId: "CON-10003", name: "Amit Patel", meterId: "MTR-10236", phone: "+91 98765 43212", email: "amit.patel@email.com", billAmount: 1800, lastPayment: "2026-02-15", status: "Paid", region: "Gujarat", state: "Gujarat", discom: "UGVCL", active: true, activeComplaint: false, complaintId: "", remainingBalance: 2300, balanceUsedByTime: { today: 45, lastWeek: 310, lastMonth: 1400, year: 16800 } },
  { id: "USR-004", consumerId: "CON-10004", name: "Sunita Devi", meterId: "MTR-10237", phone: "+91 98765 43213", email: "sunita.devi@email.com", billAmount: 4100, lastPayment: "2026-01-05", status: "Overdue", region: "Bihar", state: "Bihar", discom: "SBPDCL", active: false, activeComplaint: true, complaintId: "CMP-004", remainingBalance: 0, balanceUsedByTime: { today: 200, lastWeek: 1400, lastMonth: 5200, year: 49000 } },
  { id: "USR-005", consumerId: "CON-10005", name: "Vikram Singh", meterId: "MTR-10238", phone: "+91 98765 43214", email: "vikram.singh@email.com", billAmount: 2900, lastPayment: "2026-02-20", status: "Paid", region: "Rajasthan", state: "Rajasthan", discom: "JVVNL", active: true, activeComplaint: false, complaintId: "", remainingBalance: 1800, balanceUsedByTime: { today: 95, lastWeek: 650, lastMonth: 2700, year: 34000 } },
  { id: "USR-006", consumerId: "CON-10006", name: "Meena Kumari", meterId: "MTR-10239", phone: "+91 98765 43215", email: "meena.kumari@email.com", billAmount: 1500, lastPayment: "2026-02-01", status: "Pending", region: "UP", state: "UP", discom: "UPPCL", active: true, activeComplaint: true, complaintId: "CMP-006", remainingBalance: 900, balanceUsedByTime: { today: 55, lastWeek: 380, lastMonth: 1500, year: 18000 } },
  { id: "USR-007", consumerId: "CON-10007", name: "Arjun Reddy", meterId: "MTR-10240", phone: "+91 98765 43216", email: "arjun.reddy@email.com", billAmount: 5600, lastPayment: "2026-01-15", status: "Overdue", region: "Telangana", state: "Telangana", discom: "TSSPDCL", active: true, activeComplaint: false, complaintId: "", remainingBalance: 300, balanceUsedByTime: { today: 180, lastWeek: 1250, lastMonth: 5000, year: 67000 } },
  { id: "USR-008", consumerId: "CON-10008", name: "Kavita Nair", meterId: "MTR-10241", phone: "+91 98765 43217", email: "kavita.nair@email.com", billAmount: 2100, lastPayment: "2026-02-18", status: "Paid", region: "Kerala", state: "Kerala", discom: "KSEB", active: true, activeComplaint: false, complaintId: "", remainingBalance: 1600, balanceUsedByTime: { today: 70, lastWeek: 480, lastMonth: 1900, year: 25000 } },
  { id: "USR-009", consumerId: "CON-10009", name: "Deepak Verma", meterId: "MTR-10242", phone: "+91 98765 43218", email: "deepak.verma@email.com", billAmount: 3800, lastPayment: "2025-12-20", status: "Overdue", region: "MP", state: "MP", discom: "MPMKVVCL", active: false, activeComplaint: true, complaintId: "CMP-009", remainingBalance: 0, balanceUsedByTime: { today: 150, lastWeek: 1050, lastMonth: 4200, year: 45600 } },
  { id: "USR-010", consumerId: "CON-10010", name: "Anita Joshi", meterId: "MTR-10243", phone: "+91 98765 43219", email: "anita.joshi@email.com", billAmount: 2700, lastPayment: "2026-02-22", status: "Paid", region: "Maharashtra", state: "Maharashtra", discom: "MSEDCL", active: true, activeComplaint: false, complaintId: "", remainingBalance: 2100, balanceUsedByTime: { today: 85, lastWeek: 590, lastMonth: 2500, year: 32000 } },
  { id: "USR-011", consumerId: "CON-10011", name: "Rahul Gupta", meterId: "MTR-10244", phone: "+91 98765 43220", email: "rahul.gupta@email.com", billAmount: 1950, lastPayment: "2026-02-12", status: "Pending", region: "Delhi", state: "Delhi", discom: "BSES Yamuna", active: true, activeComplaint: false, complaintId: "", remainingBalance: 1400, balanceUsedByTime: { today: 65, lastWeek: 440, lastMonth: 1800, year: 23400 } },
  { id: "USR-012", consumerId: "CON-10012", name: "Sita Ram", meterId: "MTR-10245", phone: "+91 98765 43221", email: "sita.ram@email.com", billAmount: 4500, lastPayment: "2026-01-10", status: "Overdue", region: "UP", state: "UP", discom: "DVVNL", active: true, activeComplaint: true, complaintId: "CMP-012", remainingBalance: 200, balanceUsedByTime: { today: 160, lastWeek: 1100, lastMonth: 4300, year: 54000 } },
];

export const mockComplaints = [
  { id: "CMP-001", userName: "Rajesh Kumar", issueType: "Meter Malfunction", priority: "High" as const, status: "Open" as const, agent: "Agent A", created: "2026-02-20", notes: [] as string[] },
  { id: "CMP-002", userName: "Priya Sharma", issueType: "Billing Discrepancy", priority: "Medium" as const, status: "In Progress" as const, agent: "Agent B", created: "2026-02-18", notes: ["Investigating billing cycle mismatch"] },
  { id: "CMP-003", userName: "Amit Patel", issueType: "Connection Issue", priority: "Low" as const, status: "Resolved" as const, agent: "Agent C", created: "2026-02-15", notes: ["Resolved after field visit"] },
  { id: "CMP-004", userName: "Sunita Devi", issueType: "Power Outage", priority: "High" as const, status: "Open" as const, agent: "Unassigned", created: "2026-02-22", notes: [] as string[] },
  { id: "CMP-005", userName: "Vikram Singh", issueType: "Meter Reading Error", priority: "Medium" as const, status: "In Progress" as const, agent: "Agent A", created: "2026-02-19", notes: ["Meter recalibration scheduled"] },
  { id: "CMP-006", userName: "Meena Kumari", issueType: "Billing Discrepancy", priority: "High" as const, status: "Escalated" as const, agent: "Agent D", created: "2026-02-10", notes: ["Escalated to senior management"] },
  { id: "CMP-007", userName: "Arjun Reddy", issueType: "New Connection", priority: "Low" as const, status: "Open" as const, agent: "Agent B", created: "2026-02-21", notes: [] as string[] },
  { id: "CMP-008", userName: "Kavita Nair", issueType: "Meter Malfunction", priority: "Medium" as const, status: "Resolved" as const, agent: "Agent C", created: "2026-02-14", notes: ["Replaced faulty meter"] },
];

export const mockSmsLogs = [
  { id: "MSG-001", userName: "Rajesh Kumar", type: "Payment Reminder", status: "Delivered", sentDate: "2026-02-20 10:30" },
  { id: "MSG-002", userName: "Priya Sharma", type: "Overdue Notice", status: "Delivered", sentDate: "2026-02-19 14:15" },
  { id: "MSG-003", userName: "Amit Patel", type: "Bill Generated", status: "Failed", sentDate: "2026-02-18 09:00" },
  { id: "MSG-004", userName: "Sunita Devi", type: "Overdue Notice", status: "Delivered", sentDate: "2026-02-17 11:45" },
  { id: "MSG-005", userName: "Vikram Singh", type: "Payment Confirmation", status: "Delivered", sentDate: "2026-02-20 16:20" },
  { id: "MSG-006", userName: "Meena Kumari", type: "Payment Reminder", status: "Pending", sentDate: "2026-02-22 08:00" },
  { id: "MSG-007", userName: "Arjun Reddy", type: "Overdue Notice", status: "Failed", sentDate: "2026-02-21 13:30" },
  { id: "MSG-008", userName: "Kavita Nair", type: "Bill Generated", status: "Delivered", sentDate: "2026-02-16 10:00" },
];

export const mockTransactions = [
  { id: "TXN-001", userName: "Rajesh Kumar", meterId: "MTR-10234", amount: 2450, method: "UPI", date: "2026-02-10", status: "Success" },
  { id: "TXN-002", userName: "Amit Patel", meterId: "MTR-10236", amount: 1800, method: "Net Banking", date: "2026-02-15", status: "Success" },
  { id: "TXN-003", userName: "Vikram Singh", meterId: "MTR-10238", amount: 2900, method: "Credit Card", date: "2026-02-20", status: "Success" },
  { id: "TXN-004", userName: "Kavita Nair", meterId: "MTR-10241", amount: 2100, method: "UPI", date: "2026-02-18", status: "Success" },
  { id: "TXN-005", userName: "Anita Joshi", meterId: "MTR-10243", amount: 2700, method: "Debit Card", date: "2026-02-22", status: "Success" },
  { id: "TXN-006", userName: "Rahul Gupta", meterId: "MTR-10244", amount: 1950, method: "UPI", date: "2026-02-12", status: "Pending" },
  { id: "TXN-007", userName: "Priya Sharma", meterId: "MTR-10235", amount: 3200, method: "Net Banking", date: "2026-01-28", status: "Failed" },
  { id: "TXN-008", userName: "Deepak Verma", meterId: "MTR-10242", amount: 3800, method: "Credit Card", date: "2025-12-20", status: "Success" },
];

export const monthlyRevenue = [
  { month: "Sep", revenue: 245000 },
  { month: "Oct", revenue: 310000 },
  { month: "Nov", revenue: 285000 },
  { month: "Dec", revenue: 340000 },
  { month: "Jan", revenue: 298000 },
  { month: "Feb", revenue: 365000 },
];

export const rechargeDistribution = [
  { range: "₹0-500", count: 120 },
  { range: "₹500-1K", count: 340 },
  { range: "₹1K-2K", count: 520 },
  { range: "₹2K-3K", count: 280 },
  { range: "₹3K-5K", count: 150 },
  { range: "₹5K+", count: 60 },
];

export const complaintStatusData = [
  { name: "Open", value: 35, fill: "hsl(var(--chart-1))" },
  { name: "In Progress", value: 25, fill: "hsl(var(--chart-2))" },
  { name: "Resolved", value: 30, fill: "hsl(var(--chart-4))" },
  { name: "Escalated", value: 10, fill: "hsl(var(--chart-3))" },
];

export const revenueByState = [
  { state: "Delhi", revenue: 85000 },
  { state: "Mumbai", revenue: 72000 },
  { state: "Gujarat", revenue: 54000 },
  { state: "UP", revenue: 68000 },
  { state: "Kerala", revenue: 42000 },
  { state: "Telangana", revenue: 56000 },
];

export const paymentMethodData = [
  { name: "UPI", value: 45, fill: "hsl(var(--chart-1))" },
  { name: "Net Banking", value: 25, fill: "hsl(var(--chart-2))" },
  { name: "Credit Card", value: 18, fill: "hsl(var(--chart-3))" },
  { name: "Debit Card", value: 12, fill: "hsl(var(--chart-4))" },
];

export const smsTemplates = [
  { id: 1, name: "Payment Reminder", body: "Dear {name}, your electricity bill of ₹{amount} is due. Please pay before {dueDate} to avoid late charges. - WattWise Portal" },
  { id: 2, name: "Overdue Notice", body: "Dear {name}, your payment of ₹{amount} is overdue. Please clear your dues immediately to avoid disconnection. - WattWise Portal" },
  { id: 3, name: "Bill Generated", body: "Dear {name}, your electricity bill for {month} has been generated. Amount: ₹{amount}. View details at portal. - WattWise Portal" },
  { id: 4, name: "Payment Confirmation", body: "Dear {name}, we have received your payment of ₹{amount}. Transaction ID: {txnId}. Thank you! - WattWise Portal" },
];

export const agents = ["Agent A", "Agent B", "Agent C", "Agent D", "Unassigned"];

export function simulateApiCall<T>(data: T, delayMs = 800): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
}
