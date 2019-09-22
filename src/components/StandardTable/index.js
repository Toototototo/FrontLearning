import React from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

/**
 * Table基本表格自定义组件
 */
class Index extends React.Component {
  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  constructor(props) {
    super(props);
    const { columns } = props;
    const selectedRowKeys = props.initSelectedRowKeys;
    this.state = {
      selectedRowKeys: selectedRowKeys || [],
      columns,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initSelectedRowKeys &&
      nextProps.initSelectedRowKeys[0] !== this.props.initSelectedRowKeys[0]) {
      this.setState({
        selectedRowKeys: [
          ...nextProps.initSelectedRowKeys,
        ],
      });
    }

    if (nextProps.data.pagination.total && this.props.data.pagination.total) {
      if (nextProps.data.pagination.total < this.props.data.pagination.total) {
        this.setState({
          selectedRowKeys: [],
        });
      }
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow, isNeedeSelectedKeys } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    if (isNeedeSelectedKeys) {
      onSelectRow(selectedRowKeys, selectedRows);
    } else {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const { selectedRowKeys, columns } = this.state;
    const {
      data: { list, pagination },
      loading,
      rowKey,
      disableSelect = false,
      bordered = true,
      scroll,
      isTreeTable = false,
      expandedRowKeys = [],
      childrenColumnName = 'children',
    } = this.props;

    const newColumns = columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));


    let paginationProps;
    if (!isTreeTable && pagination) {
      paginationProps = {
        showSizeChanger: false,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: total => `共${total}条`,
        current: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        total: pagination.total,
      };
    } else {
      paginationProps = false;
    }

    let rowSelection = null;

    rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div>
        <Table
          childrenColumnName={childrenColumnName}
          bordered={bordered}
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={disableSelect ? null : rowSelection}
          dataSource={list}
          columns={newColumns}
          components={this.components}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          defaultExpandedRowKeys={expandedRowKeys}
          scroll={scroll}
        />
      </div>
    );
  }
}

Index.defaultProps = {
  data: {},
  columns: [],
};

export default Index;
