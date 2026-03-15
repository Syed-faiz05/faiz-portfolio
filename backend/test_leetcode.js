const axios = require('axios');

async function test() {
  const username = 'Syed_Faiz05';

  const query = `
    query leetcodeStats($username: String!) {
      matchedUser(username: $username) {
        profile {
          ranking
          reputation
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar(year: null) {
          streak
        }
      }
      allQuestionsCount {
        difficulty
        count
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
      }
    }
  `;

  try {
    const res = await axios.post('https://leetcode.com/graphql', { query, variables: { username } }, {
      headers: { 
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${username}/`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

test();
