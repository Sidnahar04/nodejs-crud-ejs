
/** 
 * Name:Siddharth Mahendrabhai Nahar
 * Student ID:000930031
 * Date:17-10-2024
 * Course:Fall 2024 Web Application Development (CPRG-210-A)
 * Assignment 3 : Node Daily Assignments
*/

greetings=[
    'Hello',
    'Hi',
    `What's Up`,
    'Afternoon',
    'Greetings of the day',
    'Good Morning',
    'Good Evevninhg',
    'How you doin!!'
]

function getRandomGreeting() {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

module.exports = getRandomGreeting;