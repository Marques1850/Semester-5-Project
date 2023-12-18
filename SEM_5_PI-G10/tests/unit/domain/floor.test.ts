import { Floor } from '../../../src/domain/floor';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { expect } from 'chai';
import { Result } from '../../../src/core/logic/Result';
import { MapMap } from '../../../src/mappers/MapMap';
import {Map} from '../../../src/domain/map';

describe('Floor', () => {
  it('should create a valid Floor', () => {
    // Arrange
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
        rooms: [],
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

    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    // Assert
    expect(floorResult.isSuccess).to.be.true;
    const floor = floorResult.getValue();
    expect(floor.name).to.equal('Test Floor');
    expect(floor.description).to.equal('Test Floor Description');
    expect(floor.width).to.equal(10);
    expect(floor.length).to.equal(10);
    expect(floor.plant).to.deep.equal(testMapProps.getValue());
    expect(floor.rooms).to.deep.equal([]);
    expect(floor.level).to.equal(0);
    expect(floor.buildingCode).to.equal('BC001');
  });

  it('should return an error for an invalid Floor with an invalid plant dimensions', () => {
    // Arrange
    const testMapProps = Map.create({ 
      maze: {
        size: [90, 90],
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
        rooms: [],
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    // Assert
    expect(floorResult.isFailure).to.be.true;
    expect(floorResult.error).to.include('Plant dimensions exceed floor dimensions');
  });

  it('should return an error for an invalid Floor with undefined description', () => {
    // Arrange
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
        rooms: [],
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
    const desc = undefined as any;
    const floorProps = {
      name: 'Test Floor',
      description: desc,
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    // Assert
    expect(floorResult.isFailure).to.be.true;
    expect(floorResult.error).to.include('description');
  });

  it('should return an error for an invalid Floor with undefined name', () => {
    // Arrange
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

    const nam = undefined as any;
    const floorProps = {
      name: nam,
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    // Assert
    expect(floorResult.isFailure).to.be.true;
    expect(floorResult.error).to.include('name');
  });

  it('should return an error for an invalid Floor with null name', () => {
    // Arrange
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
    const nam = null as any;
    const floorProps = {
      name: nam,
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    // Assert
    expect(floorResult.isFailure).to.be.true;
    expect(floorResult.error).to.include('name');
  });

  it('should return an error for an invalid Floor with null description', () => {
    // Arrange
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
    const desc = null as any;
    const floorProps = {
      name: 'Test Floor',
      description: desc,
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    // Assert
    expect(floorResult.isFailure).to.be.true;
    expect(floorResult.error).to.include('description');
  });

  it('should return an error for an invalid Floor with null width', () => {
    // Arrange
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
    const wi = null as any;
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: wi,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    // Assert
    expect(floorResult.isFailure).to.be.true;
    expect(floorResult.error).to.include('width');
  });

  it('should return an error for an invalid Floor with undefined width', () => {
    // Arrange
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
    const wi = undefined as any;
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: wi,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    // Assert
    expect(floorResult.isFailure).to.be.true;
    expect(floorResult.error).to.include('width');
  });

  it('should return an error for an invalid Floor with null length', () => {
    // Arrange
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
    const len = null as any;
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: len,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    // Assert
    expect(floorResult.isFailure).to.be.true;
    expect(floorResult.error).to.include('length');
  });

  it('should return an error for an invalid Floor with undefined length', () => {
    // Arrange
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
        exitLocation: [[1, 0]],  exitFloor: [],
        rooms: [],
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
    const len = undefined as any;
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: len,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    // Assert
    expect(floorResult.isFailure).to.be.true;
    expect(floorResult.error).to.include('length');
  });
  
 /* it('should set cell default correctly', () => {
    // Arrange
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
        exitLocation: [1, 0],
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());
    const floor = floorResult.getValue();

    // Act
    const result = floor.setCellDefault(5, 5, "Test");

    // Assert
    expect(result).to.be.true;
    expect(floor.plant[5][5]).to.equal("Test");
  });
  
  it('should not set cell default for invalid coordinates', () => {
    // Arrange
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
        exitLocation: [1, 0],
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());
    const floor = floorResult.getValue();

    // Act
    const result = floor.setCellDefault(0, 0, "Test");

    // Assert
    expect(result).to.be.false;
  });*/
  
  it('test get name', () => {
    // Arrange
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    const name = floorResult.getValue().name;

    // Assert
    expect(floorResult.isSuccess).to.be.true;
    expect(name).to.equal('Test Floor');
  });

  it('test get description', () => {
    // Arrange
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    const description = floorResult.getValue().description;

    // Assert
    expect(floorResult.isSuccess).to.be.true;
    expect(description).to.equal('Test Floor Description');
  });

  it('test get width', () => {
    // Arrange
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    const width = floorResult.getValue().width;

    // Assert
    expect(floorResult.isSuccess).to.be.true;
    expect(width).to.equal(10);
  });

  it('test get length', () => {
    // Arrange
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant:testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    const length = floorResult.getValue().length;

    // Assert
    expect(floorResult.isSuccess).to.be.true;
    expect(length).to.equal(10);
  });

  it('test get plant', () => {
    // Arrange
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    const plant = floorResult.getValue().plant;

    // Assert
    expect(floorResult.isSuccess).to.be.true;
    expect(plant).to.deep.equal(testMapProps.getValue());
  });

  it('test get rooms', () => {
    // Arrange
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    const rooms = floorResult.getValue().rooms;

    // Assert
    expect(floorResult.isSuccess).to.be.true;
    expect(rooms).to.deep.equal([]);
  });

  it('test get level', () => {
    // Arrange
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    const level = floorResult.getValue().level;

    // Assert
    expect(floorResult.isSuccess).to.be.true;
    expect(level).to.equal(0);
  });

  it('test get buildingCode', () => {
    // Arrange
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
    const floorProps = {
      name: 'Test Floor',
      description: 'Test Floor Description',
      width: 10,
      length: 10,
      plant: testMapProps.getValue(),
      rooms: [],
      level: 0,
      buildingCode: 'BC001'
    };

    // Act
    const floorResult: Result<Floor> = Floor.create(floorProps, new UniqueEntityID());

    const buildingCode = floorResult.getValue().buildingCode;

    // Assert
    expect(floorResult.isSuccess).to.be.true;
    expect(buildingCode).to.equal('BC001');
  });

});