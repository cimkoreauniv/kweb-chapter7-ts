interface test
{
    constructor:
    {
        name: "test"
    };
    [column: string]: any;
    [column: number]: any;
}

class C
{

}

const c:C = new C();

console.log()