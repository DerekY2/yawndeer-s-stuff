function createICS(events) {
  let icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
`;

  events.forEach(event => {
    icsContent += `
BEGIN:VEVENT
UID:${event.courseCode}@example.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(new Date(event.startDate))}
DTEND:${formatDate(new Date(new Date(event.startDate).getTime() + getDuration(event.classStartTime, event.classEndTime)))}
RRULE:FREQ=WEEKLY;BYDAY=${getDays(event.daysOfTheWeek)};UNTIL=${formatDate(new Date(event.endDate))}
SUMMARY:${event.courseName} (${event.courseCode} ${event.courseSection})
DESCRIPTION:CRN: ${event.crn}, Instructor: ${event.instructor}
LOCATION:${event.location}
END:VEVENT
`;
  });

  icsContent += 'END:VCALENDAR';
  downloadICS('calendar', icsContent.trim());
}

function formatDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function getDuration(startTime, endTime) {
  const start = new Date(`1970-01-01T${convertTo24Hour(startTime)}:00Z`);
  const end = new Date(`1970-01-01T${convertTo24Hour(endTime)}:00Z`);
  return end - start;
}

function convertTo24Hour(time) {
  const [hours, minutes] = time.split(/[: ]/);
  const period = time.split(' ')[1];
  let hours24 = parseInt(hours, 10);
  if (period === 'pm' && hours24 !== 12) {
    hours24 += 12;
  } else if (period === 'am' && hours24 === 12) {
    hours24 = 0;
  }
  return `${hours24.toString().padStart(2, '0')}:${minutes}`;
}

function getDays(daysOfTheWeek) {
  const daysMap = {
    'M': 'MO',
    'T': 'TU',
    'W': 'WE',
    'R': 'TH',
    'F': 'FR',
    'S': 'SA',
    'U': 'SU'
  };
  return daysOfTheWeek.split('').map(day => daysMap[day]).join(',');
}

function downloadICS(fileName, icsContent) {
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Example usage
createICS([
  {
    "courseName": "Introduction to Computer Science II",
    "courseCode": "COMP 1406",
    "courseSection": "E",
    "crn": "11164",
    "instructor": "Farah H. Chanchary",
    "classStartTime": "2:35 pm",
    "classEndTime": "3:55 pm",
    "daysOfTheWeek": "MW",
    "location": "Nicol Building 4010",
    "startDate": "2025-01-06T05:00:00.000Z",
    "endDate": "2025-04-08T04:00:00.000Z"
  },
  {
    "courseName": "Introduction to Computer Science II",
    "courseCode": "COMP 1406",
    "courseSection": "E2",
    "crn": "11166",
    "instructor": "Farah H. Chanchary",
    "classStartTime": "2:35 pm",
    "classEndTime": "3:55 pm",
    "daysOfTheWeek": "F",
    "location": "Herzberg Laboratories 4155",
    "startDate": "2025-01-06T05:00:00.000Z",
    "endDate": "2025-04-08T04:00:00.000Z"
  },
  {
    "courseName": "Discrete Structures I",
    "courseCode": "COMP 1805",
    "courseSection": "B",
    "crn": "11177",
    "instructor": "Alina Shaikhet",
    "classStartTime": "11:35 am",
    "classEndTime": "12:55 pm",
    "daysOfTheWeek": "TR",
    "location": "Azrieli Theatre 102",
    "startDate": "2025-01-06T05:00:00.000Z",
    "endDate": "2025-04-08T04:00:00.000Z"
  },
  {
    "courseName": "Discrete Structures I",
    "courseCode": "COMP 1805",
    "courseSection": "B3",
    "crn": "11180",
    "instructor": "Alina Shaikhet",
    "classStartTime": "2:35 pm",
    "classEndTime": "3:25 pm",
    "daysOfTheWeek": "T",
    "location": "Nideyinàn  (former UC) 282",
    "startDate": "2025-01-06T05:00:00.000Z",
    "endDate": "2025-04-08T04:00:00.000Z"
  },
  {
    "courseName": "Linear Algebra for Engineering or Science",
    "courseCode": "MATH 1104",
    "courseSection": "E",
    "crn": "13829",
    "instructor": "Kazem Ghanbari",
    "classStartTime": "11:35 am",
    "classEndTime": "12:55 pm",
    "daysOfTheWeek": "WF",
    "location": "Richcraft Hall 2200",
    "startDate": "2025-01-06T05:00:00.000Z",
    "endDate": "2025-04-08T04:00:00.000Z"
  },
  {
    "courseName": "Linear Algebra for Engineering or Science",
    "courseCode": "MATH 1104",
    "courseSection": "ET",
    "crn": "13835",
    "instructor": "",
    "classStartTime": "1:35 pm",
    "classEndTime": "2:25 pm",
    "daysOfTheWeek": "F",
    "location": "TBA",
    "startDate": "2025-01-06T05:00:00.000Z",
    "endDate": "2025-04-08T04:00:00.000Z"
  },
  {
    "courseName": "Introduction to Logic",
    "courseCode": "PHIL 2001",
    "courseSection": "B",
    "crn": "14405",
    "instructor": "Elisabeta Sarca",
    "classStartTime": "6:05 pm",
    "classEndTime": "7:55 pm",
    "daysOfTheWeek": "T",
    "location": "ON LINE",
    "startDate": "2025-01-06T05:00:00.000Z",
    "endDate": "2025-04-08T04:00:00.000Z"
  },
  {
    "courseName": "Introduction to Logic",
    "courseCode": "PHIL 2001",
    "courseSection": "B04",
    "crn": "14409",
    "instructor": "",
    "classStartTime": "2:35 pm",
    "classEndTime": "3:25 pm",
    "daysOfTheWeek": "R",
    "location": "ON LINE",
    "startDate": "2025-01-06T05:00:00.000Z",
    "endDate": "2025-04-08T04:00:00.000Z"
  },
  {
    "courseName": "Introduction to Statistical Modeling I",
    "courseCode": "STAT 2507",
    "courseSection": "E",
    "crn": "15072",
    "instructor": "Wayne S. Horn",
    "classStartTime": "6:05 pm",
    "classEndTime": "7:25 pm",
    "daysOfTheWeek": "MW",
    "location": "ON LINE",
    "startDate": "2025-01-06T05:00:00.000Z",
    "endDate": "2025-04-08T04:00:00.000Z"
  },
  {
    "courseName": "Introduction to Statistical Modeling I",
    "courseCode": "STAT 2507",
    "courseSection": "E3",
    "crn": "15075",
    "instructor": "",
    "classStartTime": "7:35 pm",
    "classEndTime": "8:25 pm",
    "daysOfTheWeek": "W",
    "location": "Herzberg Laboratories 4385",
    "startDate": "2025-01-06T05:00:00.000Z",
    "endDate": "2025-04-08T04:00:00.000Z"
  }
]);