import { expect } from 'chai';
import sinon from 'sinon';
import elevatorController from '../../../src/controllers/elevatorController';
import IElevatorDTO from '../../../src/dto/IElevatorDTO';
import ElevatorService from '../../../src/services/elevatorService';
import { Request, Response } from 'express';
import { Result } from '../../../src/core/logic/Result';
import ElevatorController from '../../../src/controllers/elevatorController';
import {elevatorType} from '../../../src/domain/elevatorType';
import { error } from 'console';
import FloorService from '../../../src/services/floorService';
import FloorController from '../../../src/controllers/floorController';
import IFloorDTO from '../../../src/dto/IFloorDTO';
import BuildingService from '../../../src/services/buildingService';
import { MapMap } from '../../../src/mappers/MapMap';
import {Map} from '../../../src/domain/map';
import { Readable } from 'stream';

declare module 'express-serve-static-core' {
  interface Request {
    token?: any;
  }
}

describe('floor Controller', () => {
  let elevatorService: ElevatorService;
    let floorService: FloorService;
    let buildingService: BuildingService;
    let floorController: FloorController;
 




    beforeEach( function() {
        elevatorService = sinon.createStubInstance(ElevatorService);
        floorService = sinon.createStubInstance(FloorService);
        buildingService = sinon.createStubInstance(BuildingService);
        floorController = new FloorController(floorService, elevatorService, buildingService);
       
    });

describe('create Floor', () => {
    it('should return a 201 status code and the created Elevator when successful', async () => {
        // Arrange
        let requestBody = {
            "name":"F1",
            "description": "Floor for test",
            "buildingCode": "J1",
            "level": 0,
            "width": "10",	
            "length": "10"
        };
  
        let req: Partial<Request> = {
            body: requestBody,
            token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
        };
  
        let res: Partial<Response> = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        }

        const testMapProps =Map.create({ 
          maze: {
            size: [5, 5],
            map: [
              ['W', 'W', 'W', 'W', 'W'],
              ['W', 'E', ' ', ' ', 'W'],
              ['W', ' ', 'W', ' ', 'W'],
              ['W', ' ', ' ', ' ', 'W'],
              ['W', 'W', 'W', 'W', 'W'],
            ],
            exits: [[1, 0]],
            elevators: [[2, 2]],
            exitLocation: [[1, 0]],
            exitFloor: [],
            rooms: []
          },
          ground: {
            size: { width: 10, height: 10, depth: 1 },
            segments: { width: 1, height: 1 },
            primaryColor: '#654321',
            maps: {
              color: { url: 'ground_color.jpg' },
              ao: { url: 'ground_ao.jpg', intensity: 0.5 },
              displacement: { url: 'ground_displacement.jpg', scale: 1, bias: 0 },
              normal: { url: 'ground_normal.jpg', type: 1, scale: { x: 1, y: 1 } },
              bump: { url: 'ground_bump.jpg', scale: 1 },
              roughness: { url: 'ground_roughness.jpg', rough: 0.8 },
            },
            wrapS: 1000,
            wrapT: 1000,
            repeat: { u: 5, v: 5 },
            magFilter: 1,
            minFilter: 2,
            secondaryColor: '#987654',
          },
          wall: {
            segments: { width: 1, height: 2 },
            primaryColor: '#000000',
            maps: {
              color: { url: 'wall_color.jpg' },
              ao: { url: 'wall_ao.jpg', intensity: 0.5 },
              displacement: { url: 'wall_displacement.jpg', scale: 1, bias: 0 },
              normal: { url: 'wall_normal.jpg', type: 1, scale: { x: 1, y: 1 } },
              bump: { url: 'wall_bump.jpg', scale: 1 },
              roughness: { url: 'wall_roughness.jpg', rough: 0.8 },
            },
            wrapS: 1000,
            wrapT: 1000,
            repeat: { u: 5, v: 5 },
            magFilter: 1,
            minFilter: 2,
            secondaryColor: '#CCCCCC',
          },
          player: {
            initialPosition: [2, 2],
            initialDirection: 0,
          },
        });  

        const floorDTO = {
            name: "F1",
            description: "Floor for test",
            buildingCode: "J1",
            level:"0" ,
            width: "10",
            length: "10",
            rooms: [],
            plant: MapMap.toDTO(testMapProps.getValue()),
        };
  
        (floorService.createFloor as sinon.SinonStub).resolves(Result.ok<IFloorDTO>(floorDTO));
  
        // Act
        await floorController.createFloor(req as Request, res as Response, () => {});
  
        // Assert
        sinon.assert.calledWith(res.json as sinon.SinonStub, floorDTO);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
      
    });
    
    it('should return a 400 status code and the error message when the floor creation fails', async () => {
        let requestBody = {
            "name":"F1",
            "description": "Floor for test",
            "buildingCode": "J1",
            "level": 0,
            "width": "10",	
            "length": "10"
        };
  
        let req: Partial<Request> = {
            body: requestBody,
            token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
        };
  
        let res: Partial<Response> = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        }

      
    
      const expectedResult = Result.fail<IFloorDTO>("That building does not exist");
      (floorService.createFloor as sinon.SinonStub).resolves(expectedResult);
  
        // Act
        await floorController.createFloor(req as Request, res as Response, () => {});
  
        // Assert
        sinon.assert.calledWith(res.send as sinon.SinonStub,"That building does not exist");
        sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    });
      });

  describe('update floor', () => {
    it('should return a 201 status code and the updated Floor when successful', async () => {
        let requestBody = {
            "name":"F1",
            "description": "Floor for test",
            "buildingCode": "J1",
            "level": 0,
            "width": "10",	
            "length": "10"
        };
  
        let req: Partial<Request> = {
            body: requestBody,
            token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
        };
  
        let res: Partial<Response> = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        }

        const testMapProps =Map.create({ 
          maze: {
            size: [5, 5],
            map: [
              ['W', 'W', 'W', 'W', 'W'],
              ['W', 'E', ' ', ' ', 'W'],
              ['W', ' ', 'W', ' ', 'W'],
              ['W', ' ', ' ', ' ', 'W'],
              ['W', 'W', 'W', 'W', 'W'],
            ],
            exits: [[1, 0]],
            elevators: [[2, 2]],
            exitLocation: [[1, 0]],
            exitFloor: [],
            rooms: []
          },
          ground: {
            size: { width: 10, height: 10, depth: 1 },
            segments: { width: 1, height: 1 },
            primaryColor: '#654321',
            maps: {
              color: { url: 'ground_color.jpg' },
              ao: { url: 'ground_ao.jpg', intensity: 0.5 },
              displacement: { url: 'ground_displacement.jpg', scale: 1, bias: 0 },
              normal: { url: 'ground_normal.jpg', type: 1, scale: { x: 1, y: 1 } },
              bump: { url: 'ground_bump.jpg', scale: 1 },
              roughness: { url: 'ground_roughness.jpg', rough: 0.8 },
            },
            wrapS: 1000,
            wrapT: 1000,
            repeat: { u: 5, v: 5 },
            magFilter: 1,
            minFilter: 2,
            secondaryColor: '#987654',
          },
          wall: {
            segments: { width: 1, height: 2 },
            primaryColor: '#000000',
            maps: {
              color: { url: 'wall_color.jpg' },
              ao: { url: 'wall_ao.jpg', intensity: 0.5 },
              displacement: { url: 'wall_displacement.jpg', scale: 1, bias: 0 },
              normal: { url: 'wall_normal.jpg', type: 1, scale: { x: 1, y: 1 } },
              bump: { url: 'wall_bump.jpg', scale: 1 },
              roughness: { url: 'wall_roughness.jpg', rough: 0.8 },
            },
            wrapS: 1000,
            wrapT: 1000,
            repeat: { u: 5, v: 5 },
            magFilter: 1,
            minFilter: 2,
            secondaryColor: '#CCCCCC',
          },
          player: {
            initialPosition: [2, 2],
            initialDirection: 0,
          },
        }); 
    

        const floorDTO = {
            name: "F1",
            description: "Floor for test",
            buildingCode: "J1",
            level:"0" ,
            width: "10",
            length: "10",
            rooms: [],
            plant: MapMap.toDTO(testMapProps.getValue()),
        };
  
      const expectedResult = Result.ok<IFloorDTO>(floorDTO);
       (floorService.updateFloor as sinon.SinonStub).resolves(expectedResult);

       await floorController.updateFloor(req as Request, res as Response, () => {});

      sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
      sinon.assert.calledWith(res.json as sinon.SinonStub, floorDTO);
    });

 

    it('should return a 400 status code and the error message when the floor update fails', async () => {
      
        let requestBody = {
            "name":"F1",
            "description": "Floor for test",
            "buildingCode": "J1",
            "level": 0,
            "width": "10",	
            "length": "10"
        };
  
        let req: Partial<Request> = {
            body: requestBody,
            token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
        };
  
        let res: Partial<Response> = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        }

        const floorDTO = {
            name: "F1",
            description: "Floor for test",
            buildingCode: "J1",
            level:"0" ,
            width: "10",
            length: "10",
            rooms: [],
            plant: [[]]
        };

      const expectedResult = Result.fail<IFloorDTO>("Building has no floors");
       (floorService.updateFloor as sinon.SinonStub).resolves(expectedResult);

       await floorController.updateFloor(req as Request, res as Response, () => {});

      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
      sinon.assert.calledWith(res.send as sinon.SinonStub,"Building has no floors");
    });
   

  
  });
  
describe('upload FloorMap', () => {
  it('should return a 201 status code and the uploaded floor map when successful', async () => {
    // Arrange
    const requestBody = {
      "name": "F1"
    };
   let buffer = new Buffer( [["N","N","N","N","N","N","N","N","N","N"]]);
    const req: Partial<Request> = {
      body: requestBody,
      file:{
        buffer,
        fieldname: '',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: new Readable,
        destination: '',
        filename: '',
        path: ''
      },
      token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
    };

    const res: Partial<Response> = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub()
    };
    
    const testMapProps = Map.create({ 
      maze: {
        size: [5, 5],
        map: [
          ['W', 'W', 'W', 'W', 'W'],
          ['W', 'E', ' ', ' ', 'W'],
          ['W', ' ', 'W', ' ', 'W'],
          ['W', ' ', ' ', ' ', 'W'],
          ['W', 'W', 'W', 'W', 'W'],
        ],
        exits: [[1, 0]],
        elevators: [[2, 2]],
        exitLocation: [[1, 0]],
        exitFloor: [],
        rooms: []
      },
      ground: {
        size: { width: 10, height: 10, depth: 1 },
        segments: { width: 1, height: 1 },
        primaryColor: '#654321',
        maps: {
          color: { url: 'ground_color.jpg' },
          ao: { url: 'ground_ao.jpg', intensity: 0.5 },
          displacement: { url: 'ground_displacement.jpg', scale: 1, bias: 0 },
          normal: { url: 'ground_normal.jpg', type: 1, scale: { x: 1, y: 1 } },
          bump: { url: 'ground_bump.jpg', scale: 1 },
          roughness: { url: 'ground_roughness.jpg', rough: 0.8 },
        },
        wrapS: 1000,
        wrapT: 1000,
        repeat: { u: 5, v: 5 },
        magFilter: 1,
        minFilter: 2,
        secondaryColor: '#987654',
      },
      wall: {
        segments: { width: 1, height: 2 },
        primaryColor: '#000000',
        maps: {
          color: { url: 'wall_color.jpg' },
          ao: { url: 'wall_ao.jpg', intensity: 0.5 },
          displacement: { url: 'wall_displacement.jpg', scale: 1, bias: 0 },
          normal: { url: 'wall_normal.jpg', type: 1, scale: { x: 1, y: 1 } },
          bump: { url: 'wall_bump.jpg', scale: 1 },
          roughness: { url: 'wall_roughness.jpg', rough: 0.8 },
        },
        wrapS: 1000,
        wrapT: 1000,
        repeat: { u: 5, v: 5 },
        magFilter: 1,
        minFilter: 2,
        secondaryColor: '#CCCCCC',
      },
      player: {
        initialPosition: [2, 2],
        initialDirection: 0,
      },
    });

    const floorDTO = {
        name: "F1",
        description: "Floor for test",
        buildingCode: "J1",
        level:"0" ,
        width: "10",
        length: "10",
        rooms: [],
        plant: MapMap.toDTO(testMapProps.getValue()),
    };

    (floorService.uploadFloorMap as sinon.SinonStub).resolves(Result.ok<IFloorDTO>(floorDTO));

    // Act
    await floorController.uploadFloorMap(req as Request, res as Response, () => {});

    // Assert
    sinon.assert.calledWith(res.json as sinon.SinonStub, floorDTO);
    sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
  });

  it('should return a 400 status code and the error message when the floor map upload fails', async () => {
    const requestBody = {
      "name": "F1",
  
    };
      let buffer= new Buffer( [[]]);
    const req: Partial<Request> = {
      body: requestBody,
      file:{
        buffer,
        fieldname: '',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: new Readable,
        destination: '',
        filename: '',
        path: ''
      },
      token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
    };

    const res: Partial<Response> = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub()
    };

    const expectedResult =  Result.fail<IFloorDTO>("Floor not found");
    (floorService.uploadFloorMap as sinon.SinonStub).resolves(expectedResult);

    // Act
    await floorController.uploadFloorMap(req as Request, res as Response, () => {});

    // Assert
    sinon.assert.calledWith(res.send as sinon.SinonStub, "Floor not found");
    sinon.assert.calledWith(res.status as sinon.SinonStub, 400);

    
  });
});
    describe('listFloorsWithElevators', () => {
  it('should return a 201 status code and an array of floors when successful', async () => {
    // Arrange
    const requestBody = {
      buildingCode: 'J1',
    };

    const req: Partial<Request> = {
      query: requestBody,
      token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
    };

    const res: Partial<Response> = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    const elevatorDTO: IElevatorDTO = {
    BuildingCode: 'J1',
    ElevatorCode: 'E1',
    FloorsAttended: [0, 1, 2]
    };

    const testMapProps = Map.create({ 
      maze: {
        size: [5, 5],
        map: [
          ['W', 'W', 'W', 'W', 'W'],
          ['W', 'E', ' ', ' ', 'W'],
          ['W', ' ', 'W', ' ', 'W'],
          ['W', ' ', ' ', ' ', 'W'],
          ['W', 'W', 'W', 'W', 'W'],
        ],
        exits: [[1, 0]],
        elevators: [[2, 2]],
        exitLocation: [[1, 0]],
        exitFloor: [],
        rooms: []
      },
      ground: {
        size: { width: 10, height: 10, depth: 1 },
        segments: { width: 1, height: 1 },
        primaryColor: '#654321',
        maps: {
          color: { url: 'ground_color.jpg' },
          ao: { url: 'ground_ao.jpg', intensity: 0.5 },
          displacement: { url: 'ground_displacement.jpg', scale: 1, bias: 0 },
          normal: { url: 'ground_normal.jpg', type: 1, scale: { x: 1, y: 1 } },
          bump: { url: 'ground_bump.jpg', scale: 1 },
          roughness: { url: 'ground_roughness.jpg', rough: 0.8 },
        },
        wrapS: 1000,
        wrapT: 1000,
        repeat: { u: 5, v: 5 },
        magFilter: 1,
        minFilter: 2,
        secondaryColor: '#987654',
      },
      wall: {
        segments: { width: 1, height: 2 },
        primaryColor: '#000000',
        maps: {
          color: { url: 'wall_color.jpg' },
          ao: { url: 'wall_ao.jpg', intensity: 0.5 },
          displacement: { url: 'wall_displacement.jpg', scale: 1, bias: 0 },
          normal: { url: 'wall_normal.jpg', type: 1, scale: { x: 1, y: 1 } },
          bump: { url: 'wall_bump.jpg', scale: 1 },
          roughness: { url: 'wall_roughness.jpg', rough: 0.8 },
        },
        wrapS: 1000,
        wrapT: 1000,
        repeat: { u: 5, v: 5 },
        magFilter: 1,
        minFilter: 2,
        secondaryColor: '#CCCCCC',
      },
      player: {
        initialPosition: [2, 2],
        initialDirection: 0,
      },
    });

    const floorDTO: IFloorDTO[] = [
      {
        name: 'F1',
        description: 'Floor for test',
        buildingCode: 'J1',
        level: '0',
        width: '10',
        length: '10',
        rooms: [],
        plant: MapMap.toDTO(testMapProps.getValue()),
      },
      {
        name: 'F2',
        description: 'Floor for test',
        buildingCode: 'J1',
        level: '1',
        width: '10',
        length: '10',
        rooms: [],
        plant: MapMap.toDTO(testMapProps.getValue()),
      },
      {
        name: 'F3',
        description: 'Floor for test',
        buildingCode: 'J1',
        level: '2',
        width: '10',
        length: '10',
        rooms: [],
        plant: MapMap.toDTO(testMapProps.getValue()),
      },
    ];

    (elevatorService.listElevatorsInBuilding as sinon.SinonStub).resolves(Result.ok<IElevatorDTO>(elevatorDTO));
    (floorService.listBuildingFloors as sinon.SinonStub).resolves(Result.ok<IFloorDTO[]>(floorDTO));

    // Act
    await floorController.listFloorsWithElevators(req as Request, res as Response, () => {});
    
    // Assert
    sinon.assert.calledWith(res.json as sinon.SinonStub, floorDTO);
    sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
  });
  

  it('should return a 400 status code and the error message when the elevator service fails', async () => {
    // Arrange
    const requestBody = {
      buildingCode: 'J2',
    };

    const req: Partial<Request> = {
      query: requestBody,
      token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
    };

    const res: Partial<Response> = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

  

    (elevatorService.listElevatorsInBuilding as sinon.SinonStub).resolves(Result.fail<IElevatorDTO>("elevators not found"));

    // Act
    await floorController.listFloorsWithElevators(req as Request, res as Response, () => {});
    // Assert
    sinon.assert.calledWith(res.send as sinon.SinonStub,"elevators not found");
    sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
  });


});
});