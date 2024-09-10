// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.24;
contract Kora {
    // user --to help track who the device belongs to
    struct User{
        string plateNumber,
        string deviceSerialNumber,
    }
    // create the evidence
    struct Record{
        uint256 id,
        uint256 deviceSerialNumber,
        uint256 speed,
        string location,
        string videoID,
        string imageID,
        uint256 alcoholLevel,
    }
    uint256 private currentId=1;
    mapping (uint256 => Record) records;
    mapping (string=>User) users;
    event datarecorded(string deviceSerialNumber);
    event userCreated(string plateNumber,string deviceSerialNumber);

    function set_data(uint256 deviceSerialNumber, uint256 speed,string memory location,string memory videoID,
    string memory imageID,  uint256 alcoholLevel)  public  {
        Record memory record=Record({
            id:currentId,
            deviceSerialNumber:deviceSerialNumber,
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
    function get_records(string memory deviceSerialNumber)  view returns (Record memory) {
        
    }
    
    function create_user(string memory plateNumber, string memory deviceSerialNumber) public {
        User memory user=User({
            plateNumber:plateNumber,
            deviceSerialNumber:deviceSerialNumber
        });
        emit userCreated(plateNumber,deviceSerialNumber);
    }
   
    
}