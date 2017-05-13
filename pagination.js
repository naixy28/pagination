class Pagination{
    constructor ( opt ) {
        this.opt = Object.assign( {}, new.target.defaultOpts , opt );
        this.rtSelector = this.opt.el;
        this.renderFn = this.opt.renderFn;

        this.rtElement = document.querySelector(this.opt.el);
        this.currPageCount = 0;
        this.state = {
            list: [],
            currPage: 0,
        }
    }

    next(){
        if ( this.state.currPage < this.currPageCount - 1 ) {
            this.setState( {currPage: ++this.state.currPage } )
        }
    }

    prev(){
        if ( this.state.currPage > 0 ) {
            this.setState( {currPage: --this.state.currPage } )
        }
    }

    setState (opt) {
        this.state = Object.assign({}, this.state, opt);
        this.update();
    }

    calPageRange() {
        const len = this.state.list.length,
            interval = this.opt.interval,
            limit = this.opt.limit;
        let start = 0,
            end = interval - 1;
        this.currPageCount = ~~(len / interval) + (len % interval > 0 ? 1 : 0);

        if ( this.state.currPage < 0 || this.currPageCount === 0 ) {
            this.state.currPage = 0;
        } else if ( this.state.currPage >= this.currPageCount  ) {
            this.state.currPage = this.currPageCount - 1;
        }
        start = interval * this.state.currPage;
        end = start + interval - 1;
        return { start: start, end: end };
    }

    get calList (){
        let currList = Array.from(this.state.list);
        this.opt.sortFn && this.opt.sortFn.call( this, currList );
        const range = this.calPageRange();

        console.log(this.currPageCount, this.state.currPage, range);

        currList = currList.filter( (val, index, arr) => {
            if( index <= range.end && index >= range.start ) {
                return true;
            }
        })

        return currList;
    }

    update () {
        this.rtElement.innerHTML = '';
        const list = this.calList;
        const dof = document.createDocumentFragment();

        list.forEach( (val, index, arr) => {
            dof.appendChild( this.renderFn.call( this, val, index, arr ));
        })

        this.rtElement.append(dof);
    }
}

Pagination.defaultOpts = {
            interval: 5,
            limit: 5
        }








