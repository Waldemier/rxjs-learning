

function getUserById(id) {
    const params = {
        access_token: 'c972d5a2b5661504eff347c3fce317c6d903cf6eb914b01314cea81d9016c002a8dcc3856aed871a69968',
        user_ids: id,
        fields: 'photo_max'
    };
    //+ params[1].key + "=" +params.user_ids + '&' + params[2].key + "=" + params.fields + '&' + params[0].key + "=" + params.access_token
    //v=5.52& - Важливе поле версії, яке потрібно вказати, для використання api VK
    return $.ajax({
        url: 'https://api.vk.com/method/users.get?v=5.52&' + $.param(params),
        type: 'GET',
        dataType: 'JSONP'
    }).promise();
}
//users.get

rxjs.fromEvent($('input'), 'keyup')
    .pipe(rxjs.operators.pluck('target', 'value'))
    .pipe(rxjs.operators.distinct())
    .pipe(rxjs.operators.debounceTime(2000))
    .pipe(rxjs.operators.mergeMap(id => rxjs.from(getUserById(id))))
    .pipe(rxjs.operators.catchError(error => rxjs.of(error)))
    .pipe(rxjs.operators.map(x => x.response[0]))
    .subscribe(
        (user) => {
            $('h1').html(`${user.first_name} ${user.last_name} <i>${user.id}</i>`);
            $('img').attr('src', user.photo_max);
        },
        error => console.log(error),
        () => console.log('Completed')
    );