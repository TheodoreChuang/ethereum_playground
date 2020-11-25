pragma solidity ^0.5.0;

contract DStorage {
    string public name = "DStorage";
    uint256 public fileCount = 0;

    // Mapping fileId=>Struct
    mapping(uint256 => File) public files;

    struct File {
        uint256 fileId;
        string fileHash;
        uint256 fileSize;
        string fileType;
        string fileName;
        string fileDescription;
        uint256 uploadTime;
        address payable uploader;
    }

    event FileUploaded(
        uint256 fileId,
        string fileHash,
        uint256 fileSize,
        string fileType,
        string fileName,
        string fileDescription,
        uint256 uploadTime,
        address payable uploader
    );

    /**
     * Upload File function
     */
    function uploadFile(
        string memory _fileHash,
        uint256 _fileSize,
        string memory _fileType,
        string memory _fileName,
        string memory _fileDescription
    ) public {
        require(bytes(_fileHash).length > 0, "File hash is required");
        require(bytes(_fileType).length > 0, "File type is required");
        require(bytes(_fileName).length > 0, "File name is required");
        require(
            bytes(_fileDescription).length > 0,
            "File description is required"
        );
        require(msg.sender != address(0), "Uploader address required");
        require(_fileSize > 0, "File size is must be greater than zero");

        fileCount++;

        files[fileCount] = File(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            now,
            msg.sender
        );

        emit FileUploaded(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            now,
            msg.sender
        );
    }
}
