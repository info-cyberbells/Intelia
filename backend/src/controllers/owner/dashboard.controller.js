export const getOwnerDashboard = async (req, res) => {
  try {
    const authUser = req.user;
    return res.json({
        success: true,
        message: "Dashboard data getting successfully",
        data: getMockDashboardData(authUser),
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
};

// Mock data function
function getMockDashboardData(authUser) {
  const userName = `${authUser.fullName}`;
  return {
    user : {
      userName : userName
    },
    stats: {
      totalDrivers: 932,
      activeDrivers: 850,
      inactiveDrivers: 82,
      totalInquiries: 1032,
      pendingInquiries: 245,
      totalIncidents: 102000,
      unresolvedIncidents: 1345,
      upcomingTasks: 32000,
    },
    recentIncidents: [
      {
        date: "2025-01-13",
        day: "Mon",
        newIssues: 1862,
        unresolved: 1345,
      },
      {
        date: "2025-01-14",
        day: "Tue",
        newIssues: 1756,
        unresolved: 1289,
      },
      {
        date: "2025-01-15",
        day: "Wed",
        newIssues: 1923,
        unresolved: 1412,
      },
      {
        date: "2025-01-16",
        day: "Thu",
        newIssues: 2145,
        unresolved: 1587,
      },
      {
        date: "2025-01-17",
        day: "Fri",
        newIssues: 1834,
        unresolved: 1298,
      },
      {
        date: "2025-01-18",
        day: "Sat",
        newIssues: 1567,
        unresolved: 1123,
      },
      {
        date: "2025-01-19",
        day: "Sun",
        newIssues: 1982,
        unresolved: 1456,
      },
    ],
    riskAssessment: [
      {
        category: "Primary (27%)",
        count: 763,
        percentage: 27,
        color: "#3B82F6", // Blue
      },
      {
        category: "Promotion (11%)",
        count: 321,
        percentage: 11,
        color: "#1E293B", // Dark Blue
      },
      {
        category: "Forum (25%)",
        count: 689,
        percentage: 25,
        color: "#FCD34D", // Yellow
      },
      {
        category: "Sidebar (16%)",
        count: 454,
        percentage: 16,
        color: "#10B981", // Green
      },
    ],
    recentDrivers: [
      {
        id: "67abc123456",
        name: "Samantha William",
        role: "Marketing Manager",
        email: "samantha@example.com",
        phoneNumber: "+447123456789",
        municipality: "Commune A",
        profileImage: "https://i.pravatar.cc/150?img=1",
        isActive: true,
        joinedDate: "2025-01-15T10:30:00.000Z",
      },
      {
        id: "67abc123457",
        name: "Tony Soap",
        role: "UI Designer",
        email: "tony@example.com",
        phoneNumber: "+447987654321",
        municipality: "Commune B",
        profileImage: "https://i.pravatar.cc/150?img=2",
        isActive: true,
        joinedDate: "2025-01-14T14:20:00.000Z",
      },
      {
        id: "67abc123458",
        name: "Karen Hope",
        role: "Web Designer",
        email: "karen@example.com",
        phoneNumber: "+447123789456",
        municipality: "Commune C",
        profileImage: "https://i.pravatar.cc/150?img=5",
        isActive: false,
        joinedDate: "2025-01-13T09:15:00.000Z",
      },
      {
        id: "67abc123459",
        name: "Jordon Nice",
        role: "Graphic Design",
        email: "jordon@example.com",
        phoneNumber: "+447456123789",
        municipality: "Commune A",
        profileImage: "https://i.pravatar.cc/150?img=8",
        isActive: true,
        joinedDate: "2025-01-12T16:45:00.000Z",
      },
      {
        id: "67abc123460",
        name: "Nadila Adja",
        role: "UI/UX Designer",
        email: "nadila@example.com",
        phoneNumber: "+447789456123",
        municipality: "Commune D",
        profileImage: "https://i.pravatar.cc/150?img=9",
        isActive: true,
        joinedDate: "2025-01-11T11:20:00.000Z",
      },
    ],
  };
}