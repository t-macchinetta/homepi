$(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDQQO_Pn--2IDt6Fk1WEo9CgYwx2UKOrBo",
        authDomain: "home-pi-a4fa2.firebaseapp.com",
        databaseURL: "https://home-pi-a4fa2.firebaseio.com",
        projectId: "home-pi-a4fa2",
        storageBucket: "home-pi-a4fa2.appspot.com",
        messagingSenderId: "280584752918"
    };
    firebase.initializeApp(config);

    //リアルタイム通信の準備
    var newPostRef = firebase.database().ref();
    // var userEmail = "";
    // var userName = "";

    // googleログイン
    firebase.auth().getRedirectResult().then(function (result) {
        if (!result.credential) {
            //ログインしていなければ認証画面にリダイレクト
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
            return;
        }
        //ログイン成功時の処理
        $('#userIcon').html('<img id="logout" src="' + result.user.photoURL + 'width="30" height="30" class="d-inline-block align-top" alt="'+ result.user.displayName +'">');
        $('#loading_start').fadeOut(100);
        $('#loading_end').fadeIn(100);
        // ユーザー情報の取得
        userEmail = result.user.email;
        userName = result.user.displayName;
        // ログインしたユーザーの情報だけ表示するようにする
        // var query = newPostRef.orderByChild('user_id').equalTo(userEmail);
        // 追加時と編集時にリアルタイムで変更する
        newPostRef.on('value', function (snapshot) {
            var str = "";
            snapshot.forEach(function(child){
                // ↓ユニークキー取得
                var k = child.key;
                // ↓データ取得
                var v = child.val();
                // 小数点の処理
                var temp = v.temperature.toFixed(2);
                var humid = v.humidity.toFixed(2);
                var press = v.pressure.toFixed(2);

                // メッセージ表示
                str = str +
                    '<div class="card mb-3 h5" id="' + k + '">' +
                        '<div class="card-header raw">' +
                            '<div class="card-title title keyword d-flex">' +
                                '<div class="w-50">temperature</div>' + 
                                '<div class="w-50 d-flex">' +
                                    '<div class="w-50 d-flex justify-content-end">' + 
                                        temp + 
                                    '</div>' + 
                                    '<div class="w-50">&nbsp;°C</div>' + 
                                '</div>' + 
                            '</div>' +
                            '<div class="card-title title keyword d-flex">' +
                                '<div class="w-50">humidity</div>' + 
                                '<div class="w-50 d-flex">' +
                                    '<div class="w-50 d-flex justify-content-end">' + 
                                        humid + 
                                    '</div>' + 
                                    '<div class="w-50">&nbsp;%</div>' + 
                                '</div>' + 
                            '</div>' +
                            '<div class="card-title title keyword d-flex">' +
                                '<div class="w-50">pressure</div>' + 
                                '<div class="w-50 d-flex">' +
                                    '<div class="w-50 d-flex justify-content-end">' + 
                                        press + 
                                    '</div>' + 
                                    '<div class="w-50">&nbsp;hPa</div>' + 
                                '</div>' + 
                            '</div>' +
                        '</div>' +
                        // '<div class="card-block hidden">' +
                        //     '<div class="card-text">updated at '+
                        //         v.date+' by '+v.username +
                        //     '</div>' +
                        //     '<div class="card-text comment keyword">' + 
                        //         v.comment + 
                        //     '</div>' +
                            // 編集ボタン
                            // '<button type="button" class="btn btn-secondary mt-2 mr-2 edit disable"><i class="material-icons">edit</i></button>' +
                            // 削除ボタン
                            // '<button type="button" class="btn btn-secondary mt-2 delete disable"><i class="material-icons">delete</i></button>' +
                        // '</div>' +
                    '</div>';
            });
            // ↓表示処理
            // 情報が変更されるたびに更新するのでhtmlにする
            $('#output').html(str);
            // タイトル順で並ぶように
            // var $arr = $('.card').sort(function(a, b){
            //     return ($(a).find('.title').text() > $(b).find('.title').text() ? 1 : -1);  //ソート条件
            // });
            // 変更した並び順で表示
            // $('#output').html($arr);
        });
    }).catch(function (error) {
        // ログイン失敗したとき
        console.log('Error', error);
        $('#username').html("Login Error.")
    });

    // googleログアウト
    $('#userIcon').on('click','#logout', function () {
        if(!confirm('You are logged in ' + userName + '\nAre you sure you want to log out?')){
            return false;
        }else{
            firebase.auth().signOut().then(function () {
                $('#loading_end').fadeOut(100);
                location.reload();
            }, function (error) {
            });
        }
    });


    // 以下，データ登録・表示関連
    
    // 編集判別要変数
    // var editStatus = 0;

    // submitでデータ送信
    // $('#send').on('click', function () {
    //     var time = new Date();
    //     var year = time.getFullYear();
    //     var month = time.getMonth() + 1;
    //     var date = time.getDate();
    //     var nowdate = year + "/" + month + "/" + date;
    //     newPostRef.push({
    //         date: nowdate,
    //         user_id: userEmail,
    //         username: userName,
    //         title: $('#title').val(),
    //         rate: $('#rate').val(),
    //         comment: $('#text').val().split('\n').join('<br>')
    //     });
        // $('#title').val("").change();
        // $('#title').val("");
        // $('#rate').val("★★★");
        // $('#text').val("");
        // 送信ボタン無効化
        // $('#send').prop('disabled', true);
        // モーダル閉じる
    //     $('body').removeClass('modal-open');
    //     $('.modal-backdrop').remove();
    //     $('#input').modal('hide');
    // });
    // タイトル未入力時はsendボタン無効化
    // $('#title').on('keyup', function(){
    //     if($('#title').val()==""){
    //         $('#send').prop('disabled', true);
    //     }else{
    //         $('#send').prop('disabled', false);
    //     }
    // });
    // 編集時も同様
    // $('#output').on('keyup','#title_edit', function(){
    //     if($('#title_edit').val()==""){
    //         $('.set').prop('disabled', true);
    //     }else{
    //         $('.set').prop('disabled', false);
    //     }
    // });

    // 編集ボタンの挙動
    // $('#output').on('click','.edit', function() {
    //     editStatus = 1;
    //     var id = $(this).parent().parent().attr("id");
    //     var username = $('#'+id).find('.username').text();
    //     var title = $('#'+id).find('.title').text();
    //     var rate = $('#'+id).find('.rate').text();
    //     var comment = $('#'+id).find('.comment').html();
    //     var editComment = comment.split('<br>').join('\n');
        // 項目を編集できるようにinputに変更する
        // $('#'+id).find('.title').html('<input type="text" id="title_edit" class="form-control" value="' + title + '"/>');
        // if(rate=="★★★★★"){
        //     $('#'+id).find('.rate').html('<select id="rate_edit" class="form-control"><option value="★★★★★" selected>★★★★★</option><option value="★★★★">★★★★</option><option value="★★★">★★★</option><option value="★★">★★</option><option value="★">★</option></select>');
        // }else if(rate=="★★★★"){
        //     $('#'+id).find('.rate').html('<select id="rate_edit" class="form-control"><option value="★★★★★">★★★★★</option><option value="★★★★" selected>★★★★</option><option value="★★★">★★★</option><option value="★★">★★</option><option value="★">★</option></select>');
        // }else if(rate=="★★★"){
        //     $('#'+id).find('.rate').html('<select id="rate_edit" class="form-control"><option value="★★★★★">★★★★★</option><option value="★★★★">★★★★</option><option value="★★★" selected>★★★</option><option value="★★">★★</option><option value="★">★</option></select>');
        // }else if(rate=="★★"){
        //     $('#'+id).find('.rate').html('<select id="rate_edit" class="form-control"><option value="★★★★★">★★★★★</option><option value="★★★★">★★★★</option><option value="★★★">★★★</option><option value="★★" selected>★★</option><option value="★">★</option></select>');
        // }else if(rate=="★"){
        //     $('#'+id).find('.rate').html('<select id="rate_edit" class="form-control"><option value="★★★★★">★★★★★</option><option value="★★★★">★★★★</option><option value="★★★">★★★</option><option value="★★">★★</option><option value="★" selected>★</option></select>');
        // }
        // $('#'+id).find('.comment').html('<textarea rows="3" id="text_edit" class="form-control">'+ editComment +'</textarea>');
        // ボタンの文言を変更する(クラスも変更して挙動をいい感じにする)
        // $('#'+id).find('.edit').html('<i class="material-icons">arrow_back</i>');
        // $('#'+id).find('.edit').addClass("cancel");
        // $('#'+id).find('.edit').removeClass("edit");
        // 変更していない部分のボタンは押せないようにする
        // $('.edit').prop('disabled', true);
        // $('#'+id).find('.delete').html('<i class="material-icons">done</i>');
        // $('#'+id).find('.delete').addClass("set");
        // $('#'+id).find('.delete').removeClass("delete");
        // $('#'+id).find('.set').addClass("btn-primary");
        // $('#'+id).find('.set').removeClass("btn-secondary");
        // $('.set').prop('disabled', true);
        // $('.delete').prop('disabled', true);
        // $('#add').prop('disabled', true);
        // $('#send').prop('disabled', true);
        // $('#search-text').prop('disabled', true);
        // $('input[name="search"]:radio').prop('disabled', true);
        // キャンセル時の挙動
        // inputを登録内容の表示に戻す
        // $('#output').on('click','.cancel', function() {
        //     $('#'+id).find('.title').html(title);
        //     $('#'+id).find('.rate').html(rate);
        //     $('#'+id).find('.comment').html(comment);
        //     $('#'+id).find('.cancel').html('<i class="material-icons">edit</i>');
        //     $('#'+id).find('.cancel').addClass("edit");
        //     $('#'+id).find('.cancel').removeClass("cancel");
        //     $('.edit').prop('disabled', false);
        //     $('#'+id).find('.set').html('<i class="material-icons">delete</i>');
        //     $('#'+id).find('.set').addClass("delete");
        //     $('#'+id).find('.set').removeClass("set");
        //     $('#'+id).find('.delete').addClass("btn-secondary");
        //     $('#'+id).find('.delete').removeClass("btn-primary");
        //     $('.delete').prop('disabled', false);
        //     $('#add').prop('disabled', false);
            // $('#send').prop('disabled', false);
        //     $('#search-text').prop('disabled', false);
        //     $('input[name="search"]:radio').prop('disabled', false);
        //     editStatus = 0;
        // });
        // 決定時の挙動
        // $('#output').on('click','.set', function() {
            // 対応するデータを更新する
            // 入力内容を取得
            // var id = $(this).parent().parent().attr("id");
            // var username = $('#username_edit').val();
            // var title = $('#title_edit').val();
            // var rate =  $('#rate_edit').val();
            // var comment = $('#text_edit').val().split('\n').join('<br>');
            // 日付
            // var time = new Date();
            // var year = time.getFullYear();
            // var month = time.getMonth() + 1;
            // var date = time.getDate();
            // var nowdate = year + "/" + month + "/" + date;
            // 更新する場所を指定
            // var bookRef = firebase.database().ref("/"+id);
            // 現在のユニークキー箇所を更新するバージョン
            // bookRef.update({
            //     date: nowdate,
            //     title: title,
            //     rate: rate,
            //     comment: comment
            // });
            // input関連を戻す
            // $('#'+id).find('.title').html(title);
            // $('#'+id).find('.rate').html(rate);
            // $('#'+id).find('.comment').html(comment);
            // $('#'+id).find('.cancel').html('<i class="material-icons">edit</i>');
            // $('#'+id).find('.cancel').addClass("edit");
            // $('#'+id).find('.cancel').removeClass("cancel");
            // $('.edit').prop('disabled', false);
            // $('#'+id).find('.set').html('<i class="material-icons">delete</i>');
            // $('#'+id).find('.set').addClass("delete");
            // $('#'+id).find('.set').removeClass("set");
            // $('#'+id).find('.delete').addClass("btn-secondary");
            // $('#'+id).find('.delete').removeClass("btn-primary");
            // $('.delete').prop('disabled', false);
            // $('#add').prop('disabled', false);
            // $('#send').prop('disabled', false);
    //         $('#search-text').prop('disabled', false);
    //         $('input[name="search"]:radio').prop('disabled', false);
    //         editStatus = 0;
    //     });
    // });


// 削除ボタンの挙動
    // $('#output').on('click','.delete', function() {
    //     if(!confirm('本当に削除しますか?')){
    //         return false;
    //     }else{
    //         // 削除時の挙動
    //         // id(ユニークキー)を取得
    //         var id = $(this).parent().parent().attr("id");
    //         newPostRef.child(id).remove();
    //         editStatus = 0;
    //     }
    // });
    
    // 検索用の関数
    // searchTitle = function(){
    //     var searchText = $('#search-text').val(), // 検索ボックスに入力された値
    //         targetText;
    //     if($("[name=search]:checked").val()=="title"){
    //         $('.title').each(function() {
    //             targetText = $(this).text();
    //             // 検索対象となるリストに入力された文字列が存在するかどうかを判断
    //             if (targetText.indexOf(searchText) != -1) {
    //                 $(this).parent().parent().removeClass('hidden');
    //             } else {
    //                 $(this).parent().parent().addClass('hidden');
    //             }
    //         });
    //     }else{
    //         $('.comment').each(function() {
    //             targetText = $(this).text();
    //             // 検索対象となるリストに入力された文字列が存在するかどうかを判断
    //             if (targetText.indexOf(searchText) != -1) {
    //                 $(this).parent().parent().removeClass('hidden');
    //             } else {
    //                 $(this).parent().parent().addClass('hidden');
    //             }
    //         });
    //     }
    // };
    // 入力かラジオボタン操作で検索
    // $('#search-text').on('keyup', searchTitle);
    // $('input[name="search"]:radio').on('click', searchTitle);
    // // 編集とかしたときに検索した状態を保存したい
    // $('#output').on('click','.set', searchTitle);
    
    // タイトルクリックで詳細表示
    // $('#output').on('click', '.card-header', function(){
    //     // var id = $(this).parent().parent().attr("id");
    //     if(editStatus==0){
    //         var id = $(this).parent().attr("id");
    //         // alert(id);
    //         $('#'+id).find('.card-block').slideToggle();
    //         // $('#'+id).find('.card-text').slideToggle();
    //         // $('#'+id).find('.btn').slideToggle();
    //         // $('#'+id).find('.title').html(title);
    //     }
    // });

    // textareaの自動リサイズ
    // $('textarea').each(function(){
    // 	$(this).css({
    // 		'overflow':'hidden',
    // 		'resize':'none'
	   // })
	   // .data('original_row',$(this).attr('rows'));
    //     });
    //     $('textarea').bind('keyup', function(){
    //     	var self = this;
    //     	var value = $(this).val().split("\n");
    //     	var value_row = 0;
    //     	$.each(value,function(i,val){
    //     	    value_row += Math.max(Math.ceil(val.length/self.cols),1);
    // 	});
    // 	var input_row = $(this).attr('rows');
    // 	var original_row = $(this).data('original_row');
    // 	var next_row = (input_row <= value_row) ? value_row+1 : Math.max(value_row+1,original_row);
    // 	$(this).attr('rows',next_row);
    // });


    // メニュー押したときに調整
    // $('.navbar-toggler').on('click', function(){
    //   $('#output').css('margin-top','196px'); 
    // });

});



// ジャンル分け
// 著者
// 出版年
// 出版社