var cmtNewFrmElem = document.querySelector('#cmtNewFrm');

// 댓글달기 버튼
if(cmtNewFrmElem) {
    var newSubmitBtnElem = cmtNewFrmElem.querySelector('input[type=submit]');
    newSubmitBtnElem.addEventListener('click', function (e) {
        e.preventDefault();

        if (cmtNewFrmElem.ctnt.value.length === 0) {
            alert('댓글 내용을 작성해 주세요.');
            return;
        }

        var param = {
            iboard: cmtListContainerElem.dataset.iboard,
            ctnt: cmtNewFrmElem.ctnt.value
        };

        var url = '/board/cmt?proc=ins';
        fetch(url, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(param)
        }).then(function (res) {
            return res.json();
        }).then(function (data) {
            switch (data.result) {
                case 0:
                    alert('댓글 달기를 할 수 없습니다.');
                    break;
                case 1:
                    cmtNewFrmElem.ctnt.value = '';
                    cmtListContainerElem.innerHTML = null;
                    getList();
                    break;
            }
        }).catch(function (err) {
            console.log(err);
            alert('댓글 달기에 실패하였습니다.');
        });
    });
}

var cmtListContainerElem = document.querySelector('#cmtListContainer');

// 좋아요 표시
var heartElem = document.querySelector('#selHeart');
selHeart();
function selHeart() {
    var loginUserPk = cmtListContainerElem.dataset.loginuserpk;
    var data = heartElem.dataset.isheart;
    setHeartDisplay(data, loginUserPk);
}

function setHeartDisplay(data, pk) {
    var isHeart = data;
    var selHeartElem = document.querySelector('#selHeart');
    if(pk > 0) {
        var iElem = document.createElement('p');
        iElem.style.display = 'inline';
        if (isHeart === 1) {
            iElem.classList.add('fas', 'fa-heart');
        } else {
            iElem.classList.add('far', 'fa-heart');
        }
        iElem.style.cursor = 'pointer';
        selHeartElem.appendChild(iElem);
    }
}

// 좋아요 기능
if(heartElem) {
    heartElem.addEventListener('click', function () {
        var value = heartElem.children[0].className;
        var proc = 0;
        switch (value) {
            case 'fas fa-heart':
                proc = 2;
                break;
            case 'far fa-heart':
                proc = 1;
                break;
        }
        var url = '/board/heart?proc=' + proc + '&iboard=' + cmtListContainerElem.dataset.iboard;

        fetch(url,{
            method : 'GET',
            headers : {'Content-Type' : 'application/json'}
        }).then(function(res) {
            return res.json();
        }).then(function(data) {
            if(proc === 1) {
                heartElem.children[0].className = 'fas fa-heart';
            } else {
                heartElem.children[0].className = 'far fa-heart';
            }
            console.log(data);
        }).catch(function (err) {
            alert(err);
        });
    });
}

var cmtModContainerElem = document.querySelector('.cmtModContainer');
//(댓글 수정) 취소 버튼 클릭 이벤트 연결
var btnCancelElem = cmtModContainerElem.querySelector('#btnCancel');
btnCancelElem.addEventListener('click', function() {
    cmtModContainerElem.style.display = 'none';
    var selectedTrElem = document.querySelector('.cmt_selected');
    selectedTrElem.classList.remove('cmt_selected');
});

var cmtModFrmElem = cmtModContainerElem.querySelector('#cmtModFrm');
var submitBtnElem = cmtModFrmElem.querySelector('input[type=submit]');
submitBtnElem.addEventListener('click', function(e) {
    e.preventDefault();
    var url = '/board/cmt?proc=upd';

    //댓글 수정 : ctnt, icmt
    var param = {
        'icmt': cmtModFrmElem.icmt.value,
        'ctnt': cmtModFrmElem.ctnt.value
    };

    fetch(url, {
        'method': 'POST',
        'headers': { 'Content-Type': 'application/json' },
        'body': JSON.stringify(param)
    }).then(function(res) {
        return res.json();
    }).then(function(data) {
        console.log(data.result);
        switch(data.result) {
            case 0: //수정 실패
                alert('댓글 수정을 할 수 없습니다.')
                break;
            case 1: //수정 성공
                modCtnt(param.ctnt);
                btnCancelElem.dispatchEvent(new Event('click'));
                break;
        }
    }).catch(function(err) {
        console.log(err);
    });
});

function modCtnt(ctnt) {
    var selectedTrElem = document.querySelector('.cmt_selected');
    var tdCtntElem = selectedTrElem.children[0];
    tdCtntElem.innerText = ctnt;
}

if(cmtListContainerElem) {
    function openModForm(icmt, ctnt) {
        cmtModContainerElem.style.display = 'flex';
        cmtModFrmElem.icmt.value = icmt;
        cmtModFrmElem.ctnt.value = ctnt;
    }

    function getList() {
        var iboard = cmtListContainerElem.dataset.iboard;
        var url = '/board/cmt?iboard=' + iboard;

        fetch(url).then(function(res) {
            return res.json();
        }).then(function(data) {
            console.log(data);
            displayCmt(data);
        }).catch(function (err) {
            console.log(err);
        })
    }
    function displayCmt(data) {
        var tableElem = document.createElement('table');
        tableElem.innerHTML = `
            <tr>
                <th>내용</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>비고</th>
            </tr>
        `; //템플릿 리터널
        cmtListContainerElem.appendChild(tableElem);

        var loginUserPk = cmtListContainerElem.dataset.loginuserpk === '' ? 0 : Number(cmtListContainerElem.dataset.loginuserpk);

        data.forEach(function(item) {
            var tr = document.createElement('tr');
            var ctnt = item.ctnt.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
            tr.innerHTML = `
                <td>${ctnt}</td>
                <td>${item.writerNm}</td>
                <td>${item.rdt}</td>
            `;
            tableElem.appendChild(tr);
            var lastTd = document.createElement('td');
            tr.appendChild(lastTd);

            if(loginUserPk === item.writer) {
                var btnMod = document.createElement('button');
                btnMod.innerText = '수정';
                btnMod.addEventListener('click', function() {
                    tr.classList.add('cmt_selected');
                    var ctnt = tr.children[0].innerText;
                    openModForm(item.icmt, ctnt);
                });
                var btnDel = document.createElement('button');
                btnDel.innerText = '삭제';
                btnDel.addEventListener('click', function() {
                   if(confirm('삭제 하시겠습니까?')) {
                       //삭제 ajax 처리
                       var param = {
                           icmt: item.icmt
                       };

                       var url = '/board/cmt?proc=del';
                       fetch(url, {
                           method: 'post',
                           'headers': {'Content-Type': 'application/json'},
                           body: JSON.stringify(param)
                       }).then(function(res) {
                            return res.json();
                       }).then(function(data) {
                            switch(data.result) {
                                case 0: //삭제 실패
                                    alert('댓글 삭제를 할 수 없습니다.')
                                    break;
                                case 1: //삭제 성공
                                    tr.remove();
                                    break;
                            }
                       }).catch(function(err) {
                           console.error(err);
                           alert('댓글 삭제에 실패하였습니다.');
                       });
                   }
                });

                lastTd.appendChild(btnMod);
                lastTd.appendChild(btnDel);
            }
        });
    }

}


