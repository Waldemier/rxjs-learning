// Деякі дескрипшини до різних методів не зовсім точні та зрозумілі - ЧИТАТИ ОФ.ДОКУМЕНТАЦІЮ ТА RxJS Marbles (діаграми)

//================== 1 ====================

//RxJS - це свого роду lodash, але для подій.

//npm i rxjs

//console.log(rxjs)

//Поки підписка на стрім не буде реалізована, цей стрім не буде створений, навіть якщо в коді він ініціалізований.
// Якщо стрім не використовується, то створений він не буде.

const stream$ = rxjs.Observable.create(function(observer) {
        observer.next('One'); //1
        setTimeout(() => observer.next('Five'), 4000) //5
        setTimeout(() => observer.complete(), 3000) //4 //метод компліт завершує виконання стріму (форсоване завершення), коли досягнута певна мета (в нашому випадку завершення 4-го таймауту)
                                                        // Після його виконання, подільші виконання стріма припиняються (в нашому випадку припиняється виконання next('Five'))
        setTimeout(() => observer.next('Three'), 2000) //3
        observer.next('Two') //2 //Для штучного генерування помилки існує метод error().
});


//Підписка на стрім, яка була створена, під час роботи додатку працює та відслідковує зміни нашого стріма постійно.
stream$.subscribe(data => { console.log(`Subscribe: ${data}`) },
                                     error => console.error(error),
                                                () => console.log("Completed!")); //В метод subscribe передається 3 аргумента-функції. 
                                                                                //Перша функція відповідає за повернення данних,
                                                                                //друга за обробку помилок, третя - виконується, коли стрім завершується (нічого не приймає).

                                                                                //***PS Якщо метод comlete() не реалізований, то остання функція не спрацює,
                                                                                // оскільки стрім ніколи не знає, коли він завершиться,
                                                                                // тому його потрібно форсовано завершувати.



//================== 2 ====================


//Робота стрімів з подіями

const button = document.querySelector('button'); //Через ДОМ доступилися до елементу кнопки

const testStream$ = rxjs.fromEvent(button, 'click'); //Зареєстрували стрім-подію на цю кнопку

testStream$.subscribe(event => console.log(event)); //Підписалися на цей стрім

rxjs.fromEvent(document.getElementById('first_input'), 'keydown') //Зареєстрували стрім-подію
    .subscribe(data => console.log(data), error => console.error(error)) //Одразу підписалися на неї

rxjs.fromEvent(document, 'mousemove')
    .subscribe(data => document.querySelector('h1').innerHTML = `X: ${data.clientX}, Y: ${data.clientY}`, error => console.error(error))




//============3======================



//of ,interval, range

//of використовується для стріму спостерігання послідовних об'єктів
rxjs.of(5,7,'9',10,14,'17', [4,5,6]).subscribe(x => console.log(x), error => console.error(error), ()=> console.log("Complited !"))


//interval(ms)
//PS: pipe(rxjs.operators.take(5)) - зупиняє роботу стріма на 5 елементі******
rxjs.interval(2000).pipe(rxjs.operators.take(5)).subscribe(x => console.log(x), er => console.error(er), () => console.log("Interval Stream was finally!")) // 0 1 2 3 4 .... кожні 2 секунти

//Після 4-х секундної затримки почнемо отримувати значення через кожні пів секунди
rxjs.timer(4000, 500).pipe(rxjs.operators.take(5)).subscribe(x => console.log(x), er => console.error(er), () => console.log("Timer Stream was finally!"))

//від/по
rxjs.range(1, 15).subscribe(x => console.log(x), er => console.error(er), () => console.log("Range Stream was finally!"))



//============ 4 =====================



const set = new Set([1,2,3,3,3,4,5, {id:6}])
const map = new Map([[1,2], [3,4], [5,6]])

//from - метод створення стріму для масиву елементів (або масиву об'єктів), множини (Set), та пар ключів/значень Map.
rxjs.from([1,2,3,4]).subscribe(data => console.log(data), er => console.log(er), () => console.log("From stream for array was finally!"))

rxjs.from(set).subscribe(data => console.log(data), er => console.log(er), () => console.log("From stream for Set was finally!"))

rxjs.from(map).subscribe(data => console.log(data), er => console.log(er), () => console.log("From stream for Map was finally!"))




//============ 5 Створення стрімів з промісів =====================



function delay(ms)
{
    return new Promise((resolve, reject) =>{
        setTimeout(() => resolve(), ms)
    })
}

const streamPromise$ = rxjs.from(delay(3000))
streamPromise$.subscribe((data) => console.log(data), error => console.error(error), () => console.log("Stream promise was finished!"))



// ==== 8 (map (Аналогічний методу масивів) та pluck) ====


// Можна пробувати імпортувати map з модуля operators (який знаходиться в модулі rxjs), але такий спосіб виклику map та інших операторів теж валідний.
//pipe - це свого роду фільтр, який приймає та змінює вхідні данні відповідно до виразу який в ньому записаний та передає їх методу subscribe(), або наступному деякому фільтру pipe().
rxjs.of('TypeScript', 'JavaScript', 'RxJS').pipe(rxjs.operators.map(x => x.toUpperCase())).subscribe(data => console.log(data), () => console.log("Stream map method is finally!"))

//метод pluck дістає поля та властивості з об'єкту (вузлу)

const input = document.getElementById('second_input');
//Ми можемо викликати безліч методів перед методом subscribe (підпискою на стрім).
rxjs.fromEvent(input, 'keydown')
    // .pipe(rxjs.operators.map(x => x.target.value))
    .pipe(rxjs.operators.pluck('target', 'value')) //Ідентичний верхньому закоментованому способу (доступилися до поля target та взяли його властивість value)
    .pipe(rxjs.operators.map(x => x.toUpperCase()))
    .pipe(rxjs.operators.map(x => { return { value:x, length: x.length } })) //Всі ці 3 методи map будуть працювати як один.
    .subscribe(data => console.log("map: ", data), er => console.error(er), () => console.log("Stream second map method is finally!"))



//========== 7 (Оператори вибірки даних) =============

//first(), last() - нічого не приймають, find(), findIndex()  - приймають функцію-обробник,
// take(amount_elements) - приймає ксть елементів, які потрібно повернути,
// skip(number) - пропускає деяку кількість елементів до початку роботи стріма,
// skipWhile() - приймає функцію-обробник, яка ставить умову які саме значення потрібно пропускати,
//takeWhile() - робить те саме, що й skipWhile(), але навпаки,
//skipUntil(), takeUntil() - приймають таймер.

rxjs.of(5, 7, "Hello", "World")
    .pipe(rxjs.operators.find(x => x === 7))
    .subscribe(x => console.log("Data with find: ", x), error => console.error(error))

rxjs.from([5,7, "Hello", "World"])
    .pipe(rxjs.operators.skipWhile(x => typeof x === 'number'))
    .subscribe(x => console.log("Data with skipWhile: ", x), error => console.error(error))

rxjs.from([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
    .pipe(rxjs.operators.skipWhile(x => x < 5))
    .pipe(rxjs.operators.takeWhile(x => x <= 12))
    .subscribe(x => console.log("Data with skipWhile and takeWhile: ", x), error => console.error(error))

rxjs.interval(1000)
    .pipe(rxjs.operators.skipUntil(rxjs.timer(5000))) //Пропускаємо 5 секунд 
    .pipe(rxjs.operators.takeUntil(rxjs.timer(10000))) //Підбираємо всі значення до 10 секунд
    .subscribe(x => console.log("Data with skipUntil and takeUntil: ", x), error => console.error(error))




//========== 8 (Оператори фільтрування даних) ==============


//filter(x => ...) - приймає функцію-обробник та на основі неї фільтрує деякі данні;

//debounceTime() - приймає ксть мілісекунд (призупиняє виклик стрімів-подій на певну кількість мілісекунд 
//(використовується для того, щоб не перегружати сервер великою кількістю запитів));

// distinct()  - не викликає події, якщо значення у вікні не змінилося (нічого не приймає)
//(використовується для того, щоб не відсилати дані на сервер повторно якщо вікно вводу (або що) не змінилося).

//distinctUntilChanged() - Свого роду Set, тільки для стрімів (нічого не приймає).

rxjs.range(1, 15)
    .pipe(rxjs.operators.filter(x => x >= 10)) //10 11 12 ...
    .subscribe(x => console.log(x), er => console.error(er), () => console.log("Range with Filter Stream was finally!"))

const cars = [
    {name: "audi", price: 10000},
    {name: "mercedes", price: 20000},
    {name: "bmw", price: 15000}
]

rxjs.fromEvent(document.getElementById('third_input'), 'keydown')
    .pipe(rxjs.operators.map( sym => sym.target.value ))
    .pipe(rxjs.operators.distinct()) //Опертор, описаний вище
    .subscribe(data => {
        console.log(data)
        rxjs.from(cars)
            .pipe(rxjs.operators.filter(c => c.name === data))
            .subscribe(car => { document.querySelector('div').innerHTML = `<h1> ${car.name.toUpperCase()} </h1><h4> ${car.price} </h4>`})})

rxjs.from([1,2,3,3,3,3,4,4,4,7,7,7,11,21,21,21,44,44,50]) //1 2 3 4 7 11 21 ...
    .pipe(rxjs.operators.distinctUntilChanged())
    .subscribe(element => console.log(element), error => console.log(error), () => console.log("From with distinctUntilChange was finally!"))


//========== 9 (Буфери) ==============

//Повертають масиви значень
//buffer() - приймає інші оператори (накшталт timer'а або інтервала), стрілкові функції, події ДОМ.
//bufferTime(ms) - притримує нові значення на певну ксть мілісекунд та повертає масив тих значень які назбирав.
//bufferCount(count)


rxjs.range(0,40)
    .pipe(rxjs.operators.bufferCount(10))
    .subscribe((data) => console.log(data)) //Отримаємо 4 масиви по 10 елементів


//Вивід ксті секунд між кліками
rxjs.interval(1000)
        .pipe(rxjs.operators.buffer(rxjs.fromEvent(document, 'click')))
        .subscribe(data => console.log(data))

//(3) [0, 1, 2] через 2 секунди (4) [3, 4, 5, 6] ще через дві (4) [7, 8, 9, 10]
rxjs.interval(500) //Кожні півсекунди генерується нове послідовне значення
    .pipe(rxjs.operators.bufferTime(2000), rxjs.operators.take(3)) //Вони затримуються в bufferTime кожні 2 секунди 
                                                                    //генерація завершується на 3 ітерації (затримці bufferTime)
    .subscribe(data => console.log(data))


//========== 10 (Утиліти) ==============

//defaultIfEmpty(content) - задає стріму значення по дефолту 
//(наприклад, використовується у випадках, якщо сталася ситуація, коли ніяких даних стрім не отримав і нам потрібно отримати про це інформацію).

//every(callback) - в callback задається певна умова, яка повинна виконуватися для абсолютно усіх переданих значень.
//PS. Накопичує в собі результати поперденіх пайпів та аж після їх завершення видає свій результат у subscribe.

//do/tap(callback) - можемо виводити дані на консоль перед їхнім попаданням в метод subscribe().
//delay(ms) - затримує стрім на деяку ксть мілісекунд (нічого не змінює).

rxjs.from([1,2,3,4])
        .pipe(rxjs.operators.delay(2000))
        .pipe(rxjs.operators.defaultIfEmpty("If Data is undefined")) //Спрацює в разі того, якщо ми нічого не передали
        .pipe(rxjs.operators.tap(data => console.log(`Data before map: ${data}`)))
        .pipe(rxjs.operators.map(x => x*x))
        .pipe(rxjs.operators.tap(data => console.log(`Data after map: ${data}`)))
        .pipe(rxjs.operators.every(data => typeof data === 'number'))
        .subscribe(data => console.log("DATA AFTER UTILITS: ", data)) //Поверне true (через попередній пайп)
                                                                    //Спрацює один раз за весь час (оскільки попередні пайпи накопичувалися в every)
                                                                  //Умова виконалася для усіх значень а значить every повернув свій результат у subscribe.



//========== 11 Merge та Concat ==============

//merge() - з'єднює два стріма.
//mergeAll() - з'єднює два і більше стрімів в один.

//concat() - те саме, що й merge.
//concatAll() - те саме, що й mergeAll.

//PS. Єдина відмінність між цими методами в тому, що метод concat дотримується правильної послідовності.

const s1$ = rxjs.of('Hello')
const s2$ = rxjs.of('RxJS')
//s1$.pipe(rxjs.operators.merge(s2$)).subscribe(...)

//Можемо імпортувати merge та упростити собі життя, але на даний момент курсу у мене проблеми з імпортами
s1$.pipe(rxjs.operators.merge(s2$))
        .subscribe(data => console.log(data), error => console.error(error), () => console.log("Merge was finally!"))

rxjs.range(1,3)
        .pipe(rxjs.operators.map(x => rxjs.range(1,3)))
        .pipe(rxjs.operators.mergeAll())
        .subscribe(data => console.log(data), e => console.error(e), () => console.log("MergeAll was finally!"))


const s3$ = rxjs.from([1,2,3])
const s4$ = rxjs.from([4,5,6])

s3$.pipe(rxjs.operators.concat(s4$))
        .subscribe(data => console.log(data), error => console.error(error), () => console.log("Concat was finally!"))

rxjs.range(1,3)
    .pipe(rxjs.operators.map(x => rxjs.range(x,3)))
    .pipe(rxjs.operators.concatAll())
    .subscribe(data => console.log(data), e => console.error(e), () => console.log("ConcatAll was finally!"))


//========== 12 MergeMap та ConcatMap ==============

//mergeMap() дозволяє створити 2 стріма з одною підпискою (subscribe) || Можлива реалізація з промісами.
//concatMap(x, i (де i це індекс елемента послідовності (необов'язковий параметр))) - також дозволяє створювати 2 стріма з одною підпискою (subscribe),
// відмінність в тому, що метод concat дотримується правильної послідовності.

//PS обидва методи можуть другим параметром приймати індекс елемента послідовності.

rxjs.of('Hello')
        .pipe(rxjs.operators.mergeMap(x => rxjs.of(x + ' RxJS!!!!')))
        .subscribe(data => console.log(data))


const promise = (data) => { return new Promise((resolve, reject) => { setTimeout(() => resolve(data + ' with Promise'), 2000) })}

rxjs.of('RxJs stream')
    .pipe(rxjs.operators.mergeMap(x => promise(x)))
    .subscribe(data => console.log(data))



//========== 13 (Zip, CombineLatest) ==============

//zip - об'єднює n-ну ксть стрімів, збирає їхні результати, та повертає subscribe'у масив з цих результатів.
//withLatestFrom() - об'єднює стріми, причому стріми виконується паралельно. Також збирає їхні результати у масив.
//combineLatest() -також об'єднює різні асинхронні дії та виводить їхні результати у масив, який передає subscribe().

const stream1$ = rxjs.of('Hello')
const stream2$ = rxjs.of('MacOs')

//Виконаний результат передасться методу subscribe через 3 секунди
stream1$.pipe(rxjs.operators.zip(stream2$.pipe(rxjs.operators.delay(3000)))).subscribe(data => console.log(data))


//========== 14 Обробка помилок ==============

//rxjs.throw(new Error(...)).subscribel(...)
//catch(callback)

//stream_1$.onErrorResumeNext(stream_2$) - якщо в першому стрімі виникає помилка,
// то метод onErrorResumeNext переключається на другий стрім та виконує вже його реалізацію 
//(як результат повертає результат виконання другого стріма методу subscribe).

rxjs.throwError(new Error("Something was wrong of this stream!"))
    .pipe(rxjs.operators.catchError((e) => rxjs.of("Error was catched!")))
    .subscribe((data) => console.log("Processed error : ", data))

//============== 15 (Класи Subject) ==================

// Їхня реалізація трішки відрізняється від звичайних Observable (попередніх стрімів). 
//Вони можуть бути як спостерігачами, так і тими хто триггерить події (стріми).

//rxjs.Subject()
//rxjs.BehaviorSubject() - те саме, що й Subject, тільки може приймати деяке початкове значення.
//rxjs.ReplaySubject()

//rxjs.AsyncSubject() - не повертає ніякого результату допоки не буде завершений влсноруч написаним методом complete().
//PS повертає тільки останній виконаний результат

const subject$ = new rxjs.Subject(); //має такоє свої методи next, complete, error
const int$ = new rxjs.interval(1000).pipe(rxjs.operators.take(5));

//Таким чином ми можемо реєструвати велику ксть стрімів через клас subject

int$.subscribe(subject$)

//Все спрацьовує асинхронно
subject$.subscribe(data => console.log('subject 1: ', data))
subject$.subscribe(data => console.log('subject 2: ', data))

setTimeout(() => { 
    subject$.subscribe(data => console.log('subject 3: ', data)) 
}, 2000)




const behavSub$ = new rxjs.BehaviorSubject("Start");

//Підписка має бути реалізована до початку виконання деяких триггерів
//Start Next step, BehaviorSubject was finished!
behavSub$.subscribe(data => console.log(data), e => console.error(e), () => console.log('BehaviorSubject was finished!'))

behavSub$.next('Next step')
behavSub$.complete();



const replaySub$ = new rxjs.ReplaySubject(2); //Передане число означає обмежувану ксть триггерів, яку ми можемо виконати з цим стрімом.

replaySub$.next('ReplaySubject ' + 1)
replaySub$.next('ReplaySubject ' + 2)
replaySub$.next('ReplaySubject ' + 3)

replaySub$.complete()

//Підписка має бути реалізована після виконання деяких тригерів
replaySub$.subscribe(data => console.log(data), e => console.error(e), () => console.log('ReplaySubject was finished!'))

//Повернуті останні два результати (оскільки стояло обмеження в 2 триггери)
//ReplaySubject 2
//ReplaySubject 3
//ReplaySubject was finished!


const asyncSub$ = new rxjs.AsyncSubject();

asyncSub$.next(1)
asyncSub$.next('REGULAR EXPRESSION ASYNC SUBJECT CLASS LAST ELEMENT')

asyncSub$.complete() //Обов'язково завершуємо, в інакшому випадку нічого в subscribe не передастся (тобто результату не буде зареєстрований)

asyncSub$.subscribe(data => console.log(data), e => console.error(e), () => console.log('AsyncSubject was finished!'))


//============== 16 (Реальна практика використовування бібліотеки: Додаток отримання користувачів з VK) ==================

//Переніс в окрему папку : RxJS Practice(Original)

//====================================