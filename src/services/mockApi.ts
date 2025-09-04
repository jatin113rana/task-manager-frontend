interface User {
  user_id: number;
  user_name: string;
  role: 'admin' | 'user';
}

interface Task {
  task_id: number;
  task: string;
  created_by: string;
  modified_by: string;
  created_at: string;
  modified_at: string;
}

// Mock data
let mockTasks: Task[] = [
  {
    task_id: 1,
    task: "Complete project documentation",
    created_by: "Admin User",
    modified_by: "Admin User",
    created_at: "2025-01-15T10:30:00",
    modified_at: "2025-01-15T10:30:00"
  },
  {
    task_id: 2,
    task: "Review code changes",
    created_by: "John Doe",
    modified_by: "John Doe",
    created_at: "2025-01-15T11:15:00",
    modified_at: "2025-01-15T11:15:00"
  },
  {
    task_id: 3,
    task: "Update user interface components",
    created_by: "Jane Smith",
    modified_by: "Admin User",
    created_at: "2025-01-15T09:45:00",
    modified_at: "2025-01-15T14:20:00"
  }
];

let nextTaskId = 4;
let nextUserId = 2;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth endpoints
  register: async (userData: { user_name: string; password: string; role: string }) => {
    await delay(1000);
    
    // Simulate validation
    if (userData.user_name.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    
    return {
      message: "User registered successfully",
      user_id: nextUserId++
    };
  },

  login: async (credentials: { user_name: string; password: string }) => {
    await delay(800);
    
    // Mock login validation
    if (credentials.user_name === 'admin' && credentials.password === 'admin123') {
      return {
        message: "Login successful",
        user_id: 1,
        user_name: "admin",
        role: "admin"
      };
    } else if (credentials.user_name === 'user' && credentials.password === 'user123') {
      return {
        message: "Login successful",
        user_id: 2,
        user_name: "user",
        role: "user"
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  // Task endpoints
  getTasks: async (): Promise<Task[]> => {
    await delay(600);
    return [...mockTasks];
  },

  createTask: async (taskData: { task: string; user_id: number }) => {
    await delay(800);
    
    const newTask: Task = {
      task_id: nextTaskId++,
      task: taskData.task,
      created_by: "Current User",
      modified_by: "Current User",
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString()
    };
    
    mockTasks.push(newTask);
    return newTask;
  },

  updateTask: async (taskId: number, taskData: { task: string; user_id: number }) => {
    await delay(700);
    
    const taskIndex = mockTasks.findIndex(task => task.task_id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...mockTasks[taskIndex],
      task: taskData.task,
      modified_by: "Current User",
      modified_at: new Date().toISOString()
    };
    
    mockTasks[taskIndex] = updatedTask;
    return updatedTask;
  },

  deleteTask: async (taskId: number, userId: number) => {
    await delay(500);
    
    const taskIndex = mockTasks.findIndex(task => task.task_id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks.splice(taskIndex, 1);
    return { message: "Task deleted successfully" };
  }
};