class Pagination{
    constructor ( opt ) {
        if ( !new.target) throw 'Pagination() must be called with new!';

        // merge options
        this.opt = Object.assign( {}, new.target.defaultOpts , opt );
        this.renderFn = this.opt.renderFn;

        // get containers
        this.rtElement = document.querySelector(this.opt.el);
        this.btnGpElement = document.querySelector(this.opt.btnGpEl);
        if ( !this.rtElement ) throw 'Must set a root element to place list!';

        // init state
        this.currPageCount = 0;
        this.state = {
            list: [],
            currPage: 0,
        }

        // init button group
        this.btnGpElement && this.initBtnGroup();
    }

    initBtnGroup() {
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = this.opt.prevBtnHtml;
        prevBtn.classList.add( 'pg-prev-btn', 'pg-btn' );
        prevBtn.addEventListener('click', (e) => {
            this.prev();
        })

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = this.opt.nextBtnHtml;
        nextBtn.classList.add( 'pg-next-btn', 'pg-btn' );
        nextBtn.addEventListener('click', (e) => {
            this.next();
        })

        const btnGpContainer = document.createElement('p');
        btnGpContainer.classList.add('pg-btn-gp');

        btnGpContainer.appendChild(prevBtn);
        btnGpContainer.appendChild(nextBtn);

        const stateSpan = document.createElement('span');
        stateSpan.classList.add('pg-state');

        btnGpContainer.insertBefore( stateSpan, nextBtn );

        this.btnGpElement.appendChild(btnGpContainer);
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

        // sort 
        this.opt.sortFn && Array.prototype.sort.call(currList, this.opt.sortFn );

        // get index range
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

        // run getter of calList
        const list = this.calList;

        // render list
        const dof = document.createDocumentFragment();
        list.forEach( (val, index, arr) => {
            dof.appendChild( this.renderFn.call( this, val, index, arr ));
        })
        this.rtElement.append(dof);

        // update button group text
        if ( this.btnGpElement ){
            this.btnGpElement.querySelector('.pg-state').innerHTML = `${this.state.currPage + 1} of ${this.currPageCount}`;
        }
    }
}

Pagination.defaultOpts = {
            el: '#pg-root',
            btnGpEl: '#pg-ctrl',
            interval: 5,
            limit: 5,
            prevBtnHtml: '<',
            nextBtnHtml: '>'
        }








