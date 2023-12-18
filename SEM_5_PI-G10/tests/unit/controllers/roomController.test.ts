import sinon from 'sinon';
import IRoomDTO from '../../../src/dto/IRoomDTO';
import { Request, Response } from 'express';
import { Result } from '../../../src/core/logic/Result';
import RoomService from '../../../src/services/roomService';
import RoomController from '../../../src/controllers/roomController';

declare module 'express-serve-static-core' {
    interface Request {
      token?: any;
    }
  }

describe('RoomController', () => {
  let roomService: RoomService;
  let roomController: RoomController;


    beforeEach( function() {
        roomService = sinon.createStubInstance(RoomService);
        roomController = new RoomController(roomService);
    });

    describe('createRoom', () => {
        it('should return a 201 status code and the created room when successful', async () => {
            // Arrange
            let requestBody = {
                "floorName": "flooor1",
                "name": "roomTest1",
                "description": "test",
                "roomtype": "gabinete",
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

            const roomDTO = {
                name: "roomTest1",
                description: "test",
                roomtype: "gabinete",
            };
    
            (roomService.createRoom as sinon.SinonStub).resolves(Result.ok<IRoomDTO>(roomDTO));
    
            // Act
            await roomController.createRoom(req as Request, res as Response, () => {});
    
            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        });
        
        it('should return a 400 status code and the error message when the room creation fails', async () => {
            // Arrange
            let requestBody = {
                "floorName": "flooor1",
                "name": "roomTest1",
                "description": "test",
                "roomtype": "gabinete",
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

            const roomDTO = {
                name: "roomTest1",
                description: "test",
                roomtype: "gabinete",
            };
    
            (roomService.createRoom as sinon.SinonStub).resolves(Result.fail<IRoomDTO>("Floor not found"));
    
            // Act
            await roomController.createRoom(req as Request, res as Response, () => {});
    
            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
            sinon.assert.calledWith(res.send as sinon.SinonStub, "Floor not found");
        });
        
    });


});