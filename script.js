import http from "k6/http";
import { check, group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// export const options = {
//     stages: [
//         // load test
//         // expected ada 3 user yang melakukan kunjungan
//         { duration: '2s', target: 3 },
//         { duration: '5s', target: 3 },
//         { duration: '2s', target: 3 },
//     ]
// };

export const options = {
    stages: [
        // stress test
        // expected ada 3 user yang melakukan kunjungan
        { duration: '2s', target: 3 },
        { duration: '5s', target: 3 },
        { duration: '5s', target: 10 },
        { duration: '2s', target: 3 },
    ]
};

export default function() {
    group('K6 Get Test', () => {
        let response1 = http.get('https://test.k6.io');
        check(response1, {
            'is status 200': (r) => r.status == 200
        });
    });

    group('Reqres Create User', () => {
        let url = "https://reqres.in/api/users";
        let body = JSON.stringify({
            "name": "morpheus",
            "job": "leader"
        });
        let params = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        let response2 = http.post(url, body, params);
        check(response2, {
            'is status 201': (r) => r.status == 201
        });
    });

    group('Get User reqres', () => {
        let url = "https://reqres.in/api/users/2";
        let response3 = http.get(url);
        check(response3, {
            'is status 200': (r) => r.status == 200
        });
    });
}

export function handleSummary(data) {
    return {
        "script-result.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}

