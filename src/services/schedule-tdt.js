const fetch = require('node-fetch');

async function getTimeTable({ name, pass, hocKyID, token }) {
  const urlList = {
    postAccountUrl: "https://stdportal.tdtu.edu.vn/taikhoan/dangnhap",
    getSessionUrl: "http://sso.tdt.edu.vn/Authenticate.aspx?ReturnUrl=http%3a%2f%2fthoikhoabieudukien.tdtu.edu.vn%2fkqdk",
    getRegisResultUrl: `http://thoikhoabieudukien.tdtu.edu.vn/API/XemKetQuaDangKy/LoadKetQua?hocKyID=${hocKyID}`
  }

  if (!token) {
    var postAccount = await fetch(urlList.postAccountUrl, {
      "headers": {
        "origin": "https://stdportal.tdtu.edu.vn",
        "referer": "https://stdportal.tdtu.edu.vn/taikhoan/dangnhap",
        "content-type": "application/x-www-form-urlencoded",
      },
      "body": `TextMSSV=${name}&PassMK=${pass}`,
      "method": "POST",
      "redirect": "manual"
    });

    token = postAccount.headers.get('location').split('Token=')[1];

  }

  var getSession = await fetch(urlList.getSessionUrl, {
    "headers": {
      "cookie": `AUTH_COOKIE=${token}|02/01/2025 0:00:00 AM`
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "method": "GET",
    "mode": "cors"
  });

  var sessionId = getSession.headers.get('set-cookie').split(';')[0];

  var getRegisResult = await fetch(urlList.getRegisResultUrl, {
    "headers": {
      "cookie": sessionId
    }
  });

  return getRegisResult.json();

}

const mapToNum = {
  "Thứ 2": 0,
  "Thứ 3": 1,
  "Thứ 4": 2,
  "Thứ 5": 3,
  "Thứ 6": 4,
  "Thứ 7": 5,
  "CN": 6
}

function getUsableData(list, hocKyID) {
  let usableData = { hocKyID: hocKyID, list: [] };

  usableData.list = list.map((subject) => {
    let subjectData = {};

    if (subject.LaNhomThucHanh == true)
      subjectData.subjectName = "Thực hành: " + subject.TenMonHoc;
    else
      subjectData.subjectName = subject.TenMonHoc;

    subjectData.group = subject.sNhom;

    let scheduleList = subject.LichHocString.split('    ');
    scheduleList = scheduleList.filter(x => x.trim() != '');
    scheduleList = scheduleList.map((scheduleString) => {
      scheduleString = scheduleString.trim();
      scheduleString = scheduleString.split(',').map(x => x.trim());

      let resObj = {
        period: scheduleString[0],
        weekDay: mapToNum[scheduleString[1]],
        room:  scheduleString[2],
        studyWeek: scheduleString[3]
      };

      return resObj;
    });
    subjectData.scheduleList = scheduleList;

    return subjectData;
  });

  return usableData;
}

module.exports.scheduleAPI = async (data) => {
  const res = await getTimeTable(data);
  return getUsableData(res.list, data.hocKyID);
}
