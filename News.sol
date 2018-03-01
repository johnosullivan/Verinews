pragma solidity ^0.4.18;


contract NewsManager {

    function NewsManager() public { }

    address[] news_contracts;

    event AddNews(address news, address publisher);

    function addNews(
        string _news
    ) public {
        address c_news = new News(msg.sender,_news);
        news_contracts.push(c_news);
        AddNews(c_news,msg.sender);
    }

}

contract OwnerShip {
    // The publisher who is creating the news
    address public publisher;
    // The mapping of the voters who have had voted
    mapping (address => bool) public votes;
    // Modifier for the onlyPublisher functions
    modifier onlyPublisher { require(msg.sender == publisher); _; }
    // Modifier for the onlyVoter functions
    modifier onlyVoter { require(votes[msg.sender]); _; }
    // A conditional modifier for the methods
    modifier condition(bool _condition) { require(_condition); _; }
    // To transfer ordership of news to different address
    function transferOrderOwnership(address newBuyer) onlyPublisher public { publisher = newBuyer; }
}

contract News is OwnerShip {

    uint private upvotes;
    uint private downvotes;
    string public news;

    function News(
        address _publisher,
        string _news
    ) public {
        news = _news;
        publisher = _publisher;
    }


}
