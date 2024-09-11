// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
contract Kora {
    struct User{
        string plateNumber;
        string deviceSerialNumber;
    }

    struct Record{
        uint256 id;
        string deviceSerialNumber;
        uint256 speed;
        string location;
        string videoID;
        string imageID;
        uint256 alcoholLevel;
    }
    uint256 private currentId=1;
    mapping (uint256 => Record) records;
    mapping (string=>User) users;
    event datarecorded(string deviceSerialNumber);
    event userCreated(string plateNumber,string deviceSerialNumber);

    function set_data(string memory deviceSerialNumber, uint256 speed,string memory location,string memory videoID,
    string memory imageID,  uint256 alcoholLevel)  public  {
        Record memory record=Record({
            id:currentId,
            deviceSerialNumber: deviceSerialNumber,
            speed:speed,
            location:location,
            videoID:videoID,
            imageID:imageID,
            alcoholLevel:alcoholLevel
        }); 
        records[currentId]=record;
        currentId++; 
        
        emit datarecorded(deviceSerialNumber);

    }
   
    
    function create_user(string memory plateNumber, string memory deviceSerialNumber) public {
        User memory user=User({
            plateNumber:plateNumber,
            deviceSerialNumber:deviceSerialNumber
        });
        emit userCreated(plateNumber,deviceSerialNumber);
    }
   
    
}