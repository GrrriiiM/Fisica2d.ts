export class Vetor2d implements IReadOnlyVetor2d {
    constructor(
        private _x = 0,
        private _y = 0
    ) { }

    get x(): number { return this._x; }
    get y(): number { return this._y; }

    set(x: number, y: number): Vetor2d;
    set(vetor: IReadOnlyVetor2d): Vetor2d;
    set(arg1?:any, arg2?:any): Vetor2d {
        if (arg1 instanceof Vetor2d) {
            this._x = arg1._x;
            this._y = arg1._y;
        } else {
            this._x = arg1;
            this._y = arg2;
        }
        return this;
    }

    get copia(): Vetor2d { return new Vetor2d(this._x, this._y); }

    get magQ(): number { return Math.pow(this._x, 2) + Math.pow(this._y, 2); }

    get mag(): number { return Math.sqrt(this.magQ); }

    normV(): Vetor2d {
        let m = this.mag;
        if (m == 0) return this;
        this._x /= m;
        this._y /= m;
        return this;
    }
    norm(): IReadOnlyVetor2d { return this.copia.normV(); }

    perpV(): Vetor2d{
        let x = this._x;
        this._x = -this._y;
        this._y = x;
        return this;
    }
    perp(): IReadOnlyVetor2d { return this.copia.perpV(); }

    invV(): Vetor2d {
        this._x=-this._x
        this._y=-this._y
        return this;
    }
    inv(): IReadOnlyVetor2d { return this.copia.invV(); }

    adicV(v: IReadOnlyVetor2d): Vetor2d {
        this._x+=v.x;
        this._y+=v.y;
        return this;
    }
    adic(v: IReadOnlyVetor2d): IReadOnlyVetor2d { return this.copia.adicV(v); }

    subV(v: IReadOnlyVetor2d): Vetor2d {
        this._x-=v.x;
        this._y-=v.y;
        return this;
    }
    sub(v: IReadOnlyVetor2d): IReadOnlyVetor2d { return this.copia.subV(v); }

    divV(n: number): Vetor2d {
        this._x/=n;
        this._y/=n;
        return this;
    }
    div(n: number): IReadOnlyVetor2d { return this.copia.divV(n); }

    multV(n: number): Vetor2d {
        this._x*=n;
        this._y*=n;
        return this;
    }
    mult(n: number): IReadOnlyVetor2d { return this.copia.multV(n); }

    rotV(rad: number, desvio: IReadOnlyVetor2d = new Vetor2d()): Vetor2d {
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        this.subV(desvio);
        const x = this._x;
        const y = this._y;
        this._x = x * cos - y * sin;
        this._y = x * sin + y * cos;
        this.adicV(desvio);
        return this;
    }
    rot(n: number, desvio: IReadOnlyVetor2d = new Vetor2d()): IReadOnlyVetor2d { return this.copia.rotV(n, desvio); }


    dot(vetor: IReadOnlyVetor2d): number {
        return this.x*vetor.x + this.y*vetor.y
    }

    cross(vetor: IReadOnlyVetor2d): number {
        return (this.x * vetor.y) - (this.y * vetor.x);
    }

    



    static cross3(vetorA: Vetor2d, vetorB: Vetor2d, vetorC: Vetor2d): number {
        return (vetorB.x - vetorA.x) * (vetorC.y - vetorA.y) - (vetorB.y - vetorA.y) * (vetorC.x - vetorA.x);
    }
}

export interface IReadOnlyVetor2d {
    x: number;
    y: number;
    norm(): IReadOnlyVetor2d;
    perp(): IReadOnlyVetor2d;
    inv(): IReadOnlyVetor2d;
    adic(v: IReadOnlyVetor2d): IReadOnlyVetor2d;
    sub(v: IReadOnlyVetor2d): IReadOnlyVetor2d;
    mult(n: number): IReadOnlyVetor2d;
    div(n: number): IReadOnlyVetor2d;
    rot(n: number): IReadOnlyVetor2d;
    dot(v: IReadOnlyVetor2d): number;
    cross(v: IReadOnlyVetor2d): number;
    magQ: number;
    mag: number;
}