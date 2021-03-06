import counterpart from "counterpart";
import React, { Component, Fragment } from "react";
import onClickOutside from "react-onclickoutside";
import { connect } from "react-redux";

import { getItemsByProperty } from "../../actions/WindowActions";
import FiltersItem from "./FiltersItem";

class FiltersNotFrequent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenDropdown: false,
      openFilterId: null
    };
  }

  handleClickOutside = () => {
    this.outsideClick();
  };

  outsideClick = () => {
    const { widgetShown, dropdownToggled, allowOutsideClick } = this.props;
    if (allowOutsideClick && !widgetShown) {
      dropdownToggled();
      this.toggleDropdown(false);
      this.toggleFilter(null);
    }
  };

  toggleDropdown = value => {
    this.setState({
      isOpenDropdown: value
    });
  };

  toggleFilter = index => {
    this.setState({
      openFilterId: index
    });
  };

  render() {
    const {
      data,
      windowType,
      notValidFields,
      viewId,
      handleShow,
      applyFilters,
      clearFilters,
      active
    } = this.props;

    const { isOpenDropdown, openFilterId } = this.state;

    const openFilter = getItemsByProperty(data, "filterId", openFilterId)[0];

    const activeFilters = data.filter(filter => filter.isActive);
    const activeFilter = activeFilters.length === 1 && activeFilters[0];

    return (
      <div className="filter-wrapper">
        <button
          onClick={() => this.toggleDropdown(true)}
          className={
            "btn btn-filter btn-meta-outline-secondary " +
            "btn-distance btn-sm" +
            (isOpenDropdown ? " btn-select" : "") +
            (activeFilters.length > 0 ? " btn-active" : "")
          }
        >
          <i className="meta-icon-preview" />
          {activeFilter ? (
            activeFilter.parameters &&
            activeFilter.parameters.length === 1 &&
            activeFilter.captionValue ? (
              <Fragment>
                {`${activeFilter.caption}: `}
                {activeFilter.captionValue}
              </Fragment>
            ) : (
              `${counterpart.translate("window.filters.caption2")}: ${
                activeFilter.caption
              }`
            )
          ) : (
            "Filter"
          )}
        </button>

        {isOpenDropdown && (
          <div className="filters-overlay">
            {!openFilterId && !activeFilter ? (
              <ul className="filter-menu">
                {data.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => this.toggleFilter(item.filterId)}
                  >
                    {item.caption}
                  </li>
                ))}
              </ul>
            ) : (
              <FiltersItem
                captionValue={activeFilter.captionValue}
                windowType={windowType}
                data={activeFilter.isActive ? activeFilter : openFilter}
                closeFilterMenu={() => this.toggleDropdown(false)}
                returnBackToDropdown={() => this.toggleFilter(null)}
                clearFilters={clearFilters}
                applyFilters={applyFilters}
                notValidFields={notValidFields}
                isActive={activeFilter.isActive}
                active={active}
                onShow={() => handleShow(true)}
                onHide={() => handleShow(false)}
                viewId={viewId}
                outsideClick={this.outsideClick}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allowOutsideClick: state.windowHandler.allowOutsideClick
});
export default connect(mapStateToProps)(onClickOutside(FiltersNotFrequent));
