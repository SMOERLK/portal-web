import React from 'react';
import TagBox from 'devextreme-react/tag-box';

export default class EditChannelsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onValueChanged = this.onValueChanged.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
  }

  componentDidMount() {
    console.log(this.props.data)
  }

  onValueChanged(e) {
    this.props.data.setValue(e.value);
    console.log(e)
  }

  onSelectionChanged() {
    this.props.data.component.updateDimensions();
  }

  render() {
    return <TagBox
      dataSource={this.props.data.column.lookup.dataSource}
      defaultValue={this.props.data.value}
      valueExpr="id"
      displayExpr="name"
      showSelectionControls={true}
      showMultiTagOnly={false}
      applyValueMode="useButtons"
      searchEnabled={true}
      onValueChanged={this.onValueChanged}
      onSelectionChanged={this.onSelectionChanged} />;
  }
}
