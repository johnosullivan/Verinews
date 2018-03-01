pragma solidity ^0.4.18;

contract NewsManager {
    // Constructor for the news manager
    function NewsManager() public { }
    // All the news articles
    address[] news_contracts;
    // Event trigged when news is added
    event AddNews(address news, address publisher);
    // Add news
    function addNews(
        string _news
    ) public {
        // Creates a child contract
        address c_news = new News(msg.sender,_news);
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
    function upvote() onlyHasNotVoted public payable {
        upvotes++;
        voters[msg.sender] = true;
    }
    // Only is the voters has not voted they maybe upvote
    function downvote() onlyHasNotVoted public payable {
        downvotes++;
        voters[msg.sender] = true;
    }
}
