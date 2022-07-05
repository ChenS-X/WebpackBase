const nihao = '123';


export const testFunc = (val:string):string => {
    const res = nihao + val;
    let res1 = res.substring(0, 1);
    return res1;
}