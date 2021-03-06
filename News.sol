pragma solidity ^0.4.18;

contract NewsManager {
    // Constructor for the news manager
    function NewsManager() public { }
    // All the news articles
    address[] public news_contracts;
    // Event trigged when news is added
    event AddNews(address news, address publisher);
    // All the news stoires for a publisher
    mapping (address => address[]) public stories;
    // Get count of contracts
    function numberOfNewsStories() public constant returns (uint256) {
        return news_contracts.length;
    }
    // Add news
    function addNews(
        string _news
    ) public {
        // Creates a child contract
        address c_news = new News(msg.sender,_news);
        stories[msg.sender].push(c_news);
        // Saves that contract address
        news_contracts.push(c_news);
        // Triggers the event
        AddNews(c_news,msg.sender);
    }
}

contract OwnerShip {
    // The publisher who is creating the news
    address public publisher;
    // The mapping of the voters who have had voted
    mapping (address => bool) public voters;
    // Modifier for the onlyPublisher functions
    modifier onlyPublisher { require(msg.sender == publisher); _; }
    // Modifier for the onlyVoter functions
    modifier onlyHasNotVoted { require(!voters[msg.sender]); _; }
    // A conditional modifier for the methods
    modifier condition(bool _condition) { require(_condition); _; }
    // To transfer ordership of news to different address
    function transferOrderOwnership(address newBuyer) onlyPublisher public { publisher = newBuyer; }
}

contract News is OwnerShip {
    // Contract vars
    uint public upvotes;
    uint public downvotes;
    address[] public upvoters;
    address[] public downvoters;
    uint256 public start_time = now;
    uint256 public lastvoter_timestamp;
    uint256 public end_time = start_time + 1 minutes;
    bool public votingOpened = true;
    mapping (address => uint) public gasPrice;

    address alarm;

    // The news data
    string public news;
    // Constructor for the child news contract
    function News(
        address _publisher,
        string _news
    ) public {
        // Sets the values from the parameters
        news = _news;
        publisher = _publisher;
    }
    // Gets the balance of the news contracts
    function getBalance() public constant returns (uint) {
        return address(this).balance;
    }

    // Only is the voters has not voted they maybe upvote
    function upvote(uint256 _datetime) onlyHasNotVoted public payable {
        //require(_datetime > start_time);
        //require(_datetime > lastvoter_timestamp);
        if (_datetime < end_time) {
            upvotes++;
            upvoters.push(msg.sender);
            voters[msg.sender] = true;
            lastvoter_timestamp = _datetime;
        } else {
            upvotes++;
            upvoters.push(msg.sender);
            voters[msg.sender] = true;
            //upvotes++;
            //voters[msg.sender] = true;
            done();
        }
        gasPrice[msg.sender] = msg.gas;
    }
    // Only is the voters has not voted they maybe upvote
    function downvote(uint256 _datetime) onlyHasNotVoted public payable {
        //require(_datetime > start_time);
        //require(_datetime > lastvoter_timestamp);
        if (_datetime < end_time) {
            downvotes++;
            downvoters.push(msg.sender);
            voters[msg.sender] = true;
            lastvoter_timestamp = _datetime;
        } else {
            downvotes++;
            downvoters.push(msg.sender);
            voters[msg.sender] = true;
            done();
        }
        gasPrice[msg.sender] = msg.gas;
    }

    // Gets the news details
    function details() public constant returns (string _news,bool _voted, uint _balance,bool _votingOpened,bool _isFake) {
        return (news,voters[msg.sender],address(this).balance, votingOpened,downvotes > upvotes);
    }

    function done() internal {
        //news = "done";
        votingOpened = false;

        //address res = upvoters[i];
        //res.transfer(1 ether);
        if (upvotes > downvotes) {
            //true news
            uint256 value = address(this).balance / upvotes;
            for(uint i = 0; i < upvotes; i++){
                upvoters[i].transfer(value);
            }
        } else {
            //false news
            uint256 valuea = address(this).balance / downvotes;
            for(uint ia = 0; i < downvotes; i++){
                downvoters[ia].transfer(valuea);
            }
        }

        //Money logic needs to be added
    }

    function isFake() condition(!votingOpened) public constant returns (bool) {
        return downvotes > upvotes;
    }


}
