export class Vetor2d {
    constructor(
        public x = 0,
        public y = 0
    ) { }

    set(x: number, y: number): Vetor2d;
    set(vetor: Vetor2d): Vetor2d;
    set(arg1?:any, arg2?:any): Vetor2d {
        if (arg1 instanceof Vetor2d) {
            this.x = arg1.x;
            this.y = arg1.y;
        } else {
            this.x = arg1;
            this.y = arg2;
        }
        return this;
    }

    get copia() { return new Vetor2d(this.x, this.y); }

    get magQ(): number { return Math.pow(this.x, 2) + Math.pow(this.y, 2); }

    get mag(): number { return Math.sqrt(this.magQ); }

    normV() {
        let m = this.mag;
        if (m == 0) return this;
        this.x /= m;
        this.y /= m;
        return this;
    }
    norm() { return this.copia.normV(); }

    perpV() {
        let x = this.x;
        this.x = this.y;
        this.y = -x;
        return this;
    }
    perp() { return this.copia.perpV(); }

    invV() {
        this.x=-this.x
        this.y=-this.y
        return this;
    }
    inv() { return this.copia.invV(); }

    adicV(v: Vetor2d) {
        this.x+=v.x;
        this.y+=v.y;
        return this;
    }
    adic(v: Vetor2d) { return this.copia.adicV(v); }

    subV(v: Vetor2d) {
        this.x-=v.x;
        this.y-=v.y;
        return this;
    }
    sub(v: Vetor2d) { return this.copia.subV(v); }

    divV(n: number) {
        this.x/=n;
        this.y/=n;
        return this;
    }
    div(n: number) { return this.copia.divV(n); }

    multV(n: number) {
        this.x*=n;
        this.y*=n;
        return this;
    }
    mult(n: number) { return this.copia.multV(n); }

    rotV(rad: number) {
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = this.x;
        const y = this.y;
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
        return this;
    }
    rot(n: number) { return this.copia.rotV(n); }


    dot(vetor: Vetor2d): number {
        return this.x*vetor.x + this.y*vetor.y
    }

    cross(vetor: Vetor2d): number {
        return (this.x * vetor.y) - (this.y * vetor.x);
    }

    



    static cross3(vetorA: Vetor2d, vetorB: Vetor2d, vetorC: Vetor2d): number {
        return (vetorB.x - vetorA.x) * (vetorC.y - vetorA.y) - (vetorB.y - vetorA.y) * (vetorC.x - vetorA.x);
    }
}