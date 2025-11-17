// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UserPreferences
 * @author Onchain Devrel
 * @version 1.0
 * @notice This contract stores user food preferences on Base Sepolia,
 * mapping them to Farcaster IDs (FIDs). It includes a simplified
 * ownership model for access control.
 *
 * @dev For a production environment, the FID ownership verification
 * (`setFidOwner` and `isFidOwner`) should be replaced with a more secure
 * mechanism, such as integrating with Farcaster's on-chain IdRegistry
 * to verifiably link wallet addresses to FIDs.
 */
contract UserPreferences {
    // Struct to hold user preference data
    struct UserPreference {
        string country;
        string dietaryRestrictions;
    }

    // Mapping from Farcaster ID (fid) to user preferences
    mapping(uint256 => UserPreference) public fidToPreferences;

    // Mapping from Farcaster ID (fid) to the owner's address for access control
    mapping(uint256 => address) public fidToOwner;

    // Event emitted when a user's preferences are updated
    event UserPreferencesUpdated(
        uint256 indexed fid,
        string country,
        string dietaryRestrictions
    );

    // Modifier to ensure that the caller is the owner of the Farcaster ID
    modifier isFidOwner(uint256 fid) {
        require(
            fidToOwner[fid] == msg.sender,
            "UserPreferences: Caller is not the owner of this FID"
        );
        _;
    }

    /**
     * @notice Links a Farcaster ID to the caller's wallet address.
     * @dev This is a simplified ownership model. A user must call this once.
     * @param fid The Farcaster ID to register.
     */
    function setFidOwner(uint256 fid) external {
        require(
            fidToOwner[fid] == address(0),
            "UserPreferences: FID already has an owner"
        );
        fidToOwner[fid] = msg.sender;
    }

    /**
     * @notice Sets or updates the food preferences for a given Farcaster ID.
     * @dev The caller must be the registered owner of the FID.
     * @param fid The user's Farcaster ID.
     * @param country The user's country.
     * @param dietaryRestrictions The user's dietary preferences (e.g., "vegetarian").
     */
    function setUserPreferences(
        uint256 fid,
        string calldata country,
        string calldata dietaryRestrictions
    ) external isFidOwner(fid) {
        fidToPreferences[fid] = UserPreference(country, dietaryRestrictions);
        emit UserPreferencesUpdated(fid, country, dietaryRestrictions);
    }

    /**
     * @notice Gets the food preferences for a given Farcaster ID.
     * @dev This is a view function and does not cost gas to call from off-chain.
     * @param fid The user's Farcaster ID.
     * @return The user's preference data.
     */
    function getUserPreferences(
        uint256 fid
    ) external view returns (UserPreference memory) {
        return fidToPreferences[fid];
    }
}
