export enum enumAchievements {
    // USER
    UPLOAD_AVATAR = 1,
    CHANGE_NAME,
    ACTIVATE_2FA,
    // USER RELATION 
    BLOCK_ONE_USER,
    BLOCK_3_USER,
    BLOCK_5_USER,
    BLOCK_10_USER,
    BLOCK_50_USER,
    BLOCK_100_USER,
    UNBLOCK_AN_USER,
    ADD_ONE_FRIEND,
    ADD_3_FRIEND,
    ADD_5_FRIEND,
    ADD_10_FRIEND,
    ADD_50_FRIEND,
    ADD_100_FRIEND,
    // CHAT
    CREATE_PUBLIC_CHANNEL,
    CREATE_PRIVATE_CHANNEL,
    // GAME
    WIN_ONE_GAME,
    LOSE_ONE_GAME,
}

export interface AchievementsInterface {
    id: number;
    class: string;
    name: string;
    description: string;
}

// export 

export const allAchievement: AchievementsInterface[] = [
    // USER
    {
        id: enumAchievements.UPLOAD_AVATAR,
        class: "user",
        name: "I look like that",
        description: "Upload an Avatar",
    },
    {
        id: enumAchievements.CHANGE_NAME,
        class: "user",
        name: "My name is...",
        description: "Change your user name",
    },
    {
        id: enumAchievements.ACTIVATE_2FA,
        class: "user",
        name: "Please don't hack me !",
        description: "Turn-on the 2-factor authentication",
    },
    //USER RELATION 
    {
        id: enumAchievements.BLOCK_ONE_USER,
        class: "relation",
        name: "I don't like you",
        description: "Block one user",
    },
    {
        id: enumAchievements.BLOCK_3_USER,
        class: "relation",
        name: "I don't like you 2",
        description: "Have three blocked users",
    },
    {
        id: enumAchievements.BLOCK_5_USER,
        class: "relation",
        name: "I don't like you 3",
        description: "Have five blocked users",
    },
    {
        id: enumAchievements.BLOCK_10_USER,
        class: "relation",
        name: "I don't like you 4",
        description: "Have ten blocked users",
    },
    {
        id: enumAchievements.BLOCK_50_USER,
        class: "relation",
        name: "I don't like you 5",
        description: "Have fifty blocked users",
    },
    {
        id: enumAchievements.BLOCK_100_USER,
        class: "relation",
        name: "I don't like you 6",
        description: "Have one hundred blocked users",
    },
    {
        id: enumAchievements.UNBLOCK_AN_USER,
        class: "relation",
        name: "Maybe i do like you",
        description: "Unblock an user",
    },
    {
        id: enumAchievements.ADD_ONE_FRIEND,
        class: "relation",
        name: "The more the merrier",
        description: "Add another user as friend",
    },
    {
        id: enumAchievements.ADD_3_FRIEND,
        class: "relation",
        name: "The more the merrier 2",
        description: "Have three friends",
    },
    {
        id: enumAchievements.ADD_5_FRIEND,
        class: "relation",
        name: "The more the merrier 3",
        description: "Have five friends",
    },
    {
        id: enumAchievements.ADD_10_FRIEND,
        class: "relation",
        name: "The more the merrier 4",
        description: "Have ten friends",
    },
    {
        id: enumAchievements.ADD_50_FRIEND,
        class: "relation",
        name: "The more the merrier 5",
        description: "Have fifty friends",
    },
    {
        id: enumAchievements.ADD_100_FRIEND,
        class: "relation",
        name: "The more the merrier 6",
        description: "Have one hundred friends",
    },
    // CHAT
    {
        id: enumAchievements.CREATE_PUBLIC_CHANNEL,
        class: "chat",
        name: "Hey peoples",
        description: "Create a public channel",
    },
    {
        id: enumAchievements.CREATE_PRIVATE_CHANNEL,
        class: "chat",
        name: "C.I.A",
        description: "Create a private channel",
    },
    // GAME        
    {
        id: enumAchievements.WIN_ONE_GAME,
        class: "game",
        name: "I love winning",
        description: "Win one games",
    },
    {
        id: enumAchievements.LOSE_ONE_GAME,
        class: "game",
        name: "I'm not good at this game",
        description: "Lose one game",
    },
];

