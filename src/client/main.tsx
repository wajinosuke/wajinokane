import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IndexProps {
    input: string;
}
interface IndexState {
    innerValue: string;
}
class Index extends React.Component<IndexProps, IndexState> {
    constructor(props: IndexProps) {
        super(props);
        this.state = {
            innerValue: this.props.input,
        }
    }
    handleClick = () => {
        console.log("click");
        this.setState({
            innerValue: (new Date().toISOString()),
        });
    }
    render() {
        return (
            <div>
                <button onClick={this.handleClick} />
                <div>{this.state.innerValue}</div>
            </div>
        );
    }
}

ReactDOM.render(
    <Index input="Hello" />,
    document.querySelector('#main-div')
);