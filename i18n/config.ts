
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define resources directly to avoid HTTP loading issues in this environment
const resources = {
  en: {
    translation: {
      nav: {
        dashboard: "Dashboard",
        pets: "Pets",
        calendar: "Calendar",
        assistant: "Assistant",
        trainer: "Dog Trainer",
      },
      dashboard: {
        greeting: {
          morning: "Good Morning",
          afternoon: "Good Afternoon",
          evening: "Good Evening",
          night: "Good Night"
        },
        subtitle: "Here is your smart overview for today.",
        newTask: "NEW TASK",
        schedule: "Today's Schedule",
        noTasks: "No tasks found for today.",
        addOne: "Add one now?",
        myPets: "My Pets",
        addNewPet: "Add New Pet",
        aiBanner: {
          tag: "AI Assistant",
          title: "Need Advice?",
          subtitle: "Ask PetPal AI about diet, health, or training tips.",
          button: "Start Chat"
        }
      },
      widgets: {
        petOfDay: "Pet of the Day",
        starPupil: "Star Pupil 🌟",
        nextUp: "Next Up",
        allCaughtUp: "All caught up!",
        careScore: "Care Score",
        smartInsight: "Smart Insight",
        loadingTip: "Loading smart tip..."
      },
      pets: {
        title: "My Pets",
        addPet: "Add Pet",
        noPets: "No pets added yet. Add your first companion!",
        modal: {
          title: "Add New Pet",
          name: "Name",
          species: "Species",
          breed: "Breed",
          sex: "Sex",
          dob: "Date of Birth",
          weight: "Weight (kg)",
          create: "Create Profile",
          generating: "Setting up smart schedule with Gemini AI...",
          addedSchedule: "Added suggested reminders for {{name}}!"
        }
      },
      petCard: {
        old: "old",
        kg: "kg",
        photos: "Photos",
        edit: "Edit",
        delete: "Delete"
      },
      reminder: {
        overdue: "Overdue",
        markIncomplete: "Mark as incomplete",
        markComplete: "Mark as complete",
        deleteTask: "Delete task"
      },
      taskModal: {
        title: "Add New Task",
        what: "What needs to be done?",
        placeholder: "e.g. Morning Walk, Heartgard, Grooming",
        who: "For who?",
        category: "Category",
        date: "Date",
        time: "Time",
        repeat: "Repeat?",
        cancel: "Cancel",
        save: "SAVE TASK",
        addPetFirst: "Add Pet First"
      },
      alarm: {
        reminder: "Reminder",
        markCompleted: "Mark Completed",
        snooze: "Snooze",
        dismiss: "Dismiss",
        minutes: "m",
        mute: "MUTE ALL",
        unmute: "UNMUTE",
        enableAlerts: "Enable Background Alerts",
        enableAlertsDesc: "Click to ensure you get notified when app is closed.",
        sound: "Sound",
        volume: "Volume",
        vibration: "Vibration",
        testSound: "Test Sound",
        stop: "Stop",
        criticalTitle: "Wait!",
        criticalBody: "Are you sure you gave the medication? This is important for health tracking.",
        confirm: "Yes, Confirm"
      },
      settings: {
        title: "Settings",
        tabs: {
          account: "Account",
          alarm: "Alarms",
          appearance: "Appearance",
          language: "Language",
          data: "Data & Privacy",
          labs: "Labs"
        },
        account: {
            editProfile: "Edit Profile",
            security: "Security",
            "2fa": "2-Factor Auth",
            password: "Password",
            change: "Change",
            logout: "Log Out"
        },
        alarm: {
            fadeIn: "Fade-in Volume",
            vibration: "Vibration (Mobile)",
            dnd: "Do Not Disturb"
        },
        appearance: {
            theme: "Color Theme",
            accent: "Accent Color",
            density: "UI Density"
        },
        language: {
            autoDetect: "Auto-detect Region",
            units: "Weight Units"
        },
        data: {
            export: "Export Data",
            exportDesc: "Download a copy of your pets and history.",
            clear: "Clear All Data",
            clearDesc: "Permanently remove all local data.",
            confirmClear: "Are you sure? This cannot be undone.",
            privacyTitle: "Privacy First",
            privacyDesc: "Your data is stored locally on this device. We do not track your personal information or sell your data to third parties."
        }
      },
      trainer: {
        title: "Dog Trainers",
        subtitle: "Find local verified experts",
        searchPlaceholder: "Search by name or specialty...",
        maxPrice: "Max Price",
        more: "More",
        noResults: "No trainers found matching filters.",
        demoProfile: "All profiles are for demo purposes.",
        promo: "First session 20% off",
        bookNow: "Book Now",
        wechat: "WeChat",
        scanWeChat: "Scan to add on WeChat",
        demoContact: "This is a demo contact. Do not transfer money.",
        available: "Available"
      },
      trainerCard: {
        perHr: "/hr",
        available: "Available"
      },
      assistant: {
        title: "PetPal Advisor",
        online: "Online",
        context: "Context",
        placeholder: "Ask about vaccinations, diet, or training...",
        thinking: "Thinking...",
        disclaimer: "AI can make mistakes. Always consult a real vet for medical emergencies."
      },
      calendar: {
        goodConditions: "Good conditions",
        badWeather: "Bad Weather",
        reasons: {
          HighHeat: "High Heat",
          Freezing: "Freezing",
          Rain: "Rain",
          Snow: "Snow",
          Showers: "Showers",
          Storm: "Storm"
        }
      },
      footer: {
        verified: "Verified Business",
        address: "Room 302, Building 5, Xiasha Higher Education Zone, Jianggan District, Hangzhou, Zhejiang, China",
        hours: "Mon–Sat, 9:00–19:00",
        company: "Company",
        support: "Support",
        legal: "Legal",
        links: {
          about: "About Us",
          careers: "Careers",
          partners: "Our Partners",
          services: "Dog Training Services",
          help: "Help Center",
          contact: "Contact Support",
          safety: "Safety Guidelines",
          report: "Report an Issue",
          privacy: "Privacy Policy",
          terms: "User Agreement",
          cookies: "Cookie Settings",
          compliance: "Compliance"
        },
        language: "English (US)",
        region: "Change region to see local pricing and support contacts.",
        copyright: "© 2025 PetPal Technologies Co., Ltd. All Rights Reserved.",
        icp: "Zhejiang ICP 2025-000312",
        security: "Compliant with CN Data Security Standards",
        wechatModal: {
          title: "PetPal Official",
          subtitle: "Service Account & Support",
          scan: "Scan with WeChat to access support, book services, and get exclusive member tips."
        }
      },
      filters: {
        all: "All",
        pending: "Pending",
        completed: "Done"
      },
      categories: {
        Food: "Food",
        Walk: "Walk",
        Medication: "Meds",
        Vaccination: "Vaccine",
        Grooming: "Grooming",
        Vet: "Vet",
        Other: "Other"
      },
      recurrence: {
        Once: "Once",
        Daily: "Daily",
        Weekly: "Weekly",
        Monthly: "Monthly"
      }
    }
  },
  "zh-CN": {
    translation: {
      nav: {
        dashboard: "仪表盘",
        pets: "我的宠物",
        calendar: "日历",
        assistant: "AI助手",
        trainer: "训犬师",
      },
      dashboard: {
        greeting: {
          morning: "早上好",
          afternoon: "下午好",
          evening: "晚上好",
          night: "晚安"
        },
        subtitle: "这是您的今日智能概览。",
        newTask: "新建任务",
        schedule: "今日日程",
        noTasks: "今日暂无任务。",
        addOne: "立即添加？",
        myPets: "我的宠物",
        addNewPet: "添加宠物",
        aiBanner: {
          tag: "AI 助手",
          title: "需要建议？",
          subtitle: "向 PetPal AI 咨询饮食、健康或训练技巧。",
          button: "开始咨询"
        }
      },
      widgets: {
        petOfDay: "今日萌宠",
        starPupil: "今日之星 🌟",
        nextUp: "即将到来",
        allCaughtUp: "任务已完成！",
        careScore: "关爱指数",
        smartInsight: "智能洞察",
        loadingTip: "正在加载智能建议..."
      },
      pets: {
        title: "我的宠物",
        addPet: "添加宠物",
        noPets: "暂无宠物。添加您的第一个伙伴吧！",
        modal: {
          title: "添加新宠物",
          name: "昵称",
          species: "物种",
          breed: "品种",
          sex: "性别",
          dob: "出生日期",
          weight: "体重 (kg)",
          create: "创建档案",
          generating: "正在使用 Gemini AI 生成智能计划...",
          addedSchedule: "已为 {{name}} 添加建议提醒！"
        }
      },
      petCard: {
        old: "岁",
        kg: "公斤",
        photos: "照片",
        edit: "编辑",
        delete: "删除"
      },
      reminder: {
        overdue: "逾期",
        markIncomplete: "标记为未完成",
        markComplete: "标记为完成",
        deleteTask: "删除任务"
      },
      taskModal: {
        title: "添加新任务",
        what: "需要做什么？",
        placeholder: "例如：晨间遛狗、喂药、美容",
        who: "对象",
        category: "分类",
        date: "日期",
        time: "时间",
        repeat: "重复？",
        cancel: "取消",
        save: "保存任务",
        addPetFirst: "请先添加宠物"
      },
      alarm: {
        reminder: "提醒",
        markCompleted: "标记完成",
        snooze: "小睡",
        dismiss: "关闭",
        minutes: "分",
        mute: "全部静音",
        unmute: "取消静音",
        enableAlerts: "启用后台通知",
        enableAlertsDesc: "点击以确保应用关闭时也能收到通知。",
        sound: "铃声",
        volume: "音量",
        vibration: "震动",
        testSound: "测试铃声",
        stop: "停止",
        criticalTitle: "请确认！",
        criticalBody: "您确定已经喂药了吗？这对健康追踪非常重要。",
        confirm: "是的，确认"
      },
      settings: {
        title: "设置",
        tabs: {
          account: "账户",
          alarm: "闹钟设置",
          appearance: "外观",
          language: "语言",
          data: "数据与隐私",
          labs: "实验室"
        },
        account: {
            editProfile: "编辑资料",
            security: "安全",
            "2fa": "双重验证",
            password: "密码",
            change: "修改",
            logout: "退出登录"
        },
        alarm: {
            fadeIn: "渐强音量",
            vibration: "震动 (手机)",
            dnd: "勿扰模式"
        },
        appearance: {
            theme: "色彩主题",
            accent: "强调色",
            density: "界面密度"
        },
        language: {
            autoDetect: "自动检测地区",
            units: "体重单位"
        },
        data: {
            export: "导出数据",
            exportDesc: "下载您的宠物资料和历史记录副本。",
            clear: "清除所有数据",
            clearDesc: "永久删除本地所有数据。",
            confirmClear: "确定吗？此操作无法撤销。",
            privacyTitle: "隐私优先",
            privacyDesc: "您的数据仅存储在本地设备上。我们不会追踪您的个人信息或将您的数据出售给第三方。"
        }
      },
      trainer: {
        title: "专业训犬",
        subtitle: "寻找本地认证专家",
        searchPlaceholder: "搜索姓名或专长...",
        maxPrice: "最高价格",
        more: "筛选",
        noResults: "未找到符合条件的训犬师。",
        demoProfile: "所有资料仅供演示。",
        promo: "首单 8 折优惠",
        bookNow: "立即预约",
        wechat: "微信咨询",
        scanWeChat: "扫码添加微信",
        demoContact: "此为演示联系方式，请勿转账。",
        available: "可预约"
      },
      trainerCard: {
        perHr: "/小时",
        available: "可预约"
      },
      assistant: {
        title: "PetPal 顾问",
        online: "在线",
        context: "当前对象",
        placeholder: "询问关于疫苗、饮食或训练的问题...",
        thinking: "思考中...",
        disclaimer: "AI 可能会犯错。遇到医疗紧急情况请务必咨询兽医。"
      },
      calendar: {
        goodConditions: "天气良好",
        badWeather: "天气恶劣",
        reasons: {
          HighHeat: "高温",
          Freezing: "严寒",
          Rain: "下雨",
          Snow: "下雪",
          Showers: "阵雨",
          Storm: "暴风雨"
        }
      },
      footer: {
        verified: "认证企业",
        address: "中国浙江省杭州市江干区下沙高教园区5号楼302室",
        hours: "周一至周六, 9:00–19:00",
        company: "公司信息",
        support: "客户支持",
        legal: "法律条款",
        links: {
          about: "关于我们",
          careers: "加入我们",
          partners: "合作伙伴",
          services: "训犬服务",
          help: "帮助中心",
          contact: "联系客服",
          safety: "安全指南",
          report: "问题反馈",
          privacy: "隐私政策",
          terms: "用户协议",
          cookies: "Cookie 设置",
          compliance: "合规信息"
        },
        language: "简体中文",
        region: "切换地区以查看本地价格和支持联系方式。",
        copyright: "© 2025 PetPal 科技有限公司 版权所有",
        icp: "浙ICP备2025000312号",
        security: "符合中国数据安全标准",
        wechatModal: {
          title: "PetPal 官方账号",
          subtitle: "服务号 & 客服支持",
          scan: "使用微信扫码获取支持、预约服务及专属会员贴士。"
        }
      },
      filters: {
        all: "全部",
        pending: "待办",
        completed: "已完成"
      },
      categories: {
        Food: "喂食",
        Walk: "遛弯",
        Medication: "喂药",
        Vaccination: "疫苗",
        Grooming: "美容",
        Vet: "就医",
        Other: "其他"
      },
      recurrence: {
        Once: "一次",
        Daily: "每天",
        Weekly: "每周",
        Monthly: "每月"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('petpal_language') || navigator.language || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
