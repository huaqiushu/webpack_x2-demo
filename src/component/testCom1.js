/**
 * Created by Administrator on 2018/4/17/017.
 */
import React from 'react';
const EventstateUpdater = require('events');

require.ensure([],function(require){
    var Chunks=require('./Chunk');
    console.log(Chunks.default);
},'Chunk');


class LongStringChunked extends React.Component {
    constructor() {
        super(...arguments);

        this.onInputChange = this.onInputChange.bind(this);
        this.state = {str: ''};
        this.stateUpdater = new EventstateUpdater();
    }

    onInputChange(e) {
        this.stateUpdater.emit('update', e.target.value);
        // console.log($("#test_com"));
    }

    render() {
        console.log('enter render');
        var chunk=<Chunk listen={this.stateUpdater} />;
        return <div id="test_com" className="test-com">
            <input placeholder="hahahahahahah" onChange={this.onInputChange} />
            <p>
                洗涤剂是
                让我们假装这是一段超长的字符串，包含 {chunk}  这样的子串，而且包含多个{chunk}cxzz.
                点点滴滴
            </p>
            <div className="src"></div>
            <p>所得随口时</p>
            <a href="./aHtml/a.html">跳转到a.html</a>
        </div>;
    }
}

class Chunk extends React.Component {
    constructor(props) {
        super(...arguments);

        this.state = {str: ''};
    }

    componentDidMount() {
        this.props.listen.on(
            'update',
            str  => {
                this.setState({str: str})
            }
        );
    }

    render() {
        console.log('enter chunk render');
        return this.state.str;
    }
}

export default LongStringChunked;