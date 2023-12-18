import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10) || 3000,

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb+srv://serdb2324:7Wh9wekLR9zjD3Da@isepg10.jgnlojs.mongodb.net/?retryWrites=true&w=majority"/*"mongodb://localhost:27017/test"*/,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  Auth0Secret: "rNb7M0Tr_FTqPGwYs29pQyZcNp5aCcGrYkhRRPvnxalz9GhgASzETLCIfS38K_hT",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
  
  email: {
    allowedDomain: 'isep.ipp.pt',
  },

  controllers: {
    role: {
      name: "RoleController",
      path: "../controllers/roleController"
    },
    user: {
      name: "UserController",
      path: "../controllers/userController"
    },
    building: {
      name: "BuildingController",
      path: "../controllers/buildingController"
    },
    elevator: {
      name: "ElevatorController",
      path: "../controllers/elevatorController"
    },
    floor: {
      name: "FloorController",
      path: "../controllers/floorController"
    },
    room: {
      name: "RoomController",
      path: "../controllers/roomController"
    },
    passage: {
      name: "PassageController",
      path: "../controllers/passageController"
    },
    robot: {
      name: "RobotController",
      path: "../controllers/robotController"
    },
    robotType: {
      name: "RobotTypeController",
      path: "../controllers/robotTypeController"
    },
    task: {
      name: "TaskController",
      path: "../controllers/taskController"
    },
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo"
    },
    building: {
      name: "BuildingRepo",
      path: "../repos/BuildingRepo"
    },
    elevator: {
      name: "ElevatorRepo",
      path: "../repos/ElevatorRepo"
    },
    floor: {
      name: "FloorRepo",
      path: "../repos/FloorRepo"
    },
    passage: {
      name: "PassageRepo",
      path: "../repos/PassageRepo"
    },
    robot: {
      name: "RobotRepo",
      path: "../repos/RobotRepo"
    },
    robotType: {
      name: "RobotTypeRepo",
      path: "../repos/RobotTypeRepo"
    },
    task: {
      name: "TaskRepo",
      path: "../repos/TaskRepo"
    }
  },

  services: {
    role: {
      name: "RoleService",
      path: "../services/roleService"
    },
    user: {
      name: "UserService",
      path: "../services/userService"
    },
    building: {
      name: "BuildingService",
      path: "../services/buildingService"
    },
    elevator: {
      name: "ElevatorService",
      path: "../services/elevatorService"
    },
    floor: {
      name: "FloorService",
      path: "../services/floorService"
    },
    room: {
      name: "RoomService",
      path: "../services/roomService"
    },
    passage: {
      name: "PassageService",
      path: "../services/passageService"
    },
    robot: {
      name: "RobotService",
      path: "../services/robotService"
    },
    robotType: {
      name: "RobotTypeService",
      path: "../services/robotTypeService"
    },
    task: {
      name: "TaskService",
      path: "../services/taskService"
    }

  },
};
