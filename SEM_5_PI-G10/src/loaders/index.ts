import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';


export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const userSchema = {
    // compare with the approach followed in repos and services
    name: 'userSchema',
    schema: '../persistence/schemas/userSchema',
  };

  const roleSchema = {
    // compare with the approach followed in repos and services
    name: 'roleSchema',
    schema: '../persistence/schemas/roleSchema',
  };

  const buildingSchema = {
    // compare with the approach followed in repos and services
    name: 'buildingSchema',
    schema: '../persistence/schemas/buildingSchema',
  };

  const elevatorSchema = {
    // compare with the approach followed in repos and services
    name: 'elevatorSchema',
    schema: '../persistence/schemas/elevatorSchema',
  };

  const floorSchema = {
    // compare with the approach followed in repos and services
    name: 'floorSchema',
    schema: '../persistence/schemas/floorSchema',
  };

  const passageSchema = {
    // compare with the approach followed in repos and services
    name: 'passageSchema',
    schema: '../persistence/schemas/passageSchema',
  };

  const robotSchema = {
    // compare with the approach followed in repos and services
    name: 'robotSchema',
    schema: '../persistence/schemas/robotSchema',
  };

  const robotTypeSchema = {
    // compare with the approach followed in repos and services
    name: 'robotTypeSchema',
    schema: '../persistence/schemas/robotTypeSchema',
  };

  const taskSchema = {
    // compare with the approach followed in repos and services
    name: 'taskSchema',
    schema: '../persistence/schemas/taskSchema',
  };

  const deliveryTaskSchema = {
    // compare with the approach followed in repos and services
    name: 'deliveryTaskSchema',
    schema: '../persistence/schemas/deliveryTaskSchema',
  };

  const vigilanceTaskSchema = {
    // compare with the approach followed in repos and services
    name: 'vigilanceTaskSchema',
    schema: '../persistence/schemas/vigilanceTaskSchema',
  };

  const roleController = {
    name: config.controllers.role.name,
    path: config.controllers.role.path
  }

  const userController = {
    name: config.controllers.user.name,
    path: config.controllers.user.path
  }

  const buildingController = {
    name: config.controllers.building.name,
    path: config.controllers.building.path
  }
  const elevatorController = {
    name: config.controllers.elevator.name,
    path: config.controllers.elevator.path
  }
  const floorController = {
    name: config.controllers.floor.name,
    path: config.controllers.floor.path
  }
   
  const roomController = {
    name: config.controllers.room.name,
    path: config.controllers.room.path
  }

  const passageController = {
    name: config.controllers.passage.name,
    path: config.controllers.passage.path
  }

  const robotController = {
    name: config.controllers.robot.name,
    path: config.controllers.robot.path
  }

  const rotobTypeController = {
    name: config.controllers.robotType.name,
    path: config.controllers.robotType.path
  }

  const taskController = {
    name: config.controllers.task.name,
    path: config.controllers.task.path
  }

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  }

  const roleRepo = {
    name: config.repos.role.name,
    path: config.repos.role.path
  }

  const buildingRepo = {
    name: config.repos.building.name,
    path: config.repos.building.path
  }
  const elevatorRepo = {
    name: config.repos.elevator.name,
    path: config.repos.elevator.path
  }
  const floorRepo = {
    name: config.repos.floor.name,
    path: config.repos.floor.path
  }

  const passageRepo = {
    name: config.repos.passage.name,
    path: config.repos.passage.path
  }

  const robotRepo = {
    name: config.repos.robot.name,
    path: config.repos.robot.path
  }

  const taskRepo = {
    name: config.repos.task.name,
    path: config.repos.task.path
  }

  const robotTypeRepo = {
    name: config.repos.robotType.name,
    path: config.repos.robotType.path
  }

  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  }
  const userService = {
    name: config.services.user.name,
    path: config.services.user.path
  }
  const buildingService = {
    name: config.services.building.name,
    path: config.services.building.path
  }
  const elevatorService = {
    name: config.services.elevator.name,
    path: config.services.elevator.path
  }
  const floorService = {
    name: config.services.floor.name,
    path: config.services.floor.path
  }
  const roomService = {
    name: config.services.room.name,
    path: config.services.room.path
  }

  const passageService = {
    name: config.services.passage.name,
    path: config.services.passage.path
  }

  const robotService = {
    name: config.services.robot.name,
    path: config.services.robot.path
  }

  const robotTypeService = {
    name: config.services.robotType.name,
    path: config.services.robotType.path
  }

  const taskService = {
    name: config.services.task.name,
    path: config.services.task.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      buildingSchema,
      elevatorSchema,
      floorSchema,
      passageSchema,
      robotSchema,
      robotTypeSchema,
      taskSchema,
      deliveryTaskSchema,
      vigilanceTaskSchema
    ],
    controllers: [
      roleController,
      userController,
      buildingController,
      elevatorController,
      floorController,
      roomController,
      passageController,
      robotController,
      rotobTypeController,
      taskController
    ],
    repos: [
      roleRepo,
      userRepo,
      buildingRepo,
      elevatorRepo,
      floorRepo,
      passageRepo,
      robotRepo,
      robotTypeRepo,
      taskRepo
    ],
    services: [
      roleService,
      userService,
      buildingService,
      elevatorService,
      floorService,
      roomService,
      passageService,
      robotService,
      robotTypeService,
      taskService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
