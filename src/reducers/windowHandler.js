import update from "react-addons-update";

import {
  ACTIVATE_TAB,
  ADD_NEW_ROW,
  ADD_ROW_DATA,
  ALLOW_SHORTCUT,
  ALLOW_OUTSIDE_CLICK,
  CHANGE_INDICATOR_STATE,
  CLEAR_MASTER_DATA,
  CLOSE_MODAL,
  CLOSE_PROCESS_MODAL,
  CLOSE_RAW_MODAL,
  CLOSE_FILTER_BOX,
  DELETE_ROW,
  DISABLE_SHORTCUT,
  DISABLE_OUTSIDE_CLICK,
  INIT_DATA_SUCCESS,
  INIT_LAYOUT_SUCCESS,
  NO_CONNECTION,
  OPEN_MODAL,
  OPEN_RAW_MODAL,
  OPEN_FILTER_BOX,
  PATCH_FAILURE,
  PATCH_REQUEST,
  PATCH_RESET,
  PATCH_SUCCESS,
  SELECT_TABLE_ITEMS,
  SET_LATEST_NEW_DOCUMENT,
  SORT_TAB,
  UNSELECT_TAB,
  UPDATE_DATA_FIELD_PROPERTY,
  UPDATE_DATA_INCLUDED_TABS_INFO,
  UPDATE_DATA_PROPERTY,
  UPDATE_DATA_SAVE_STATUS,
  UPDATE_DATA_VALID_STATUS,
  UPDATE_MODAL,
  UPDATE_ROW_FIELD_PROPERTY,
  UPDATE_ROW_PROPERTY,
  UPDATE_ROW_STATUS
} from "../constants/ActionTypes";

const initialState = {
  connectionError: false,
  modal: {
    visible: false,
    type: "",
    dataId: null,
    tabId: null,
    rowId: null,
    viewId: null,
    layout: {},
    data: {},
    rowData: {},
    modalTitle: "",
    modalType: "",
    isAdvanced: false,
    viewDocumentIds: null,
    childViewId: null,
    childViewSelectedIds: null,
    parentViewId: null,
    parentViewSelectedIds: null,
    triggerField: null,
    saveStatus: {},
    validStatus: {},
    includedTabsInfo: {}
  },
  rawModal: {
    visible: false,
    windowType: null,
    viewId: null
  },
  master: {
    layout: {
      activeTab: null
    },
    data: [],
    rowData: {},
    saveStatus: {},
    validStatus: {},
    includedTabsInfo: {},
    docId: undefined,
    websocket: null
  },
  indicator: "saved",
  allowShortcut: true,
  allowOutsideClick: true,
  latestNewDocument: null,
  viewId: null,
  selections: {},
  patches: {
    requests: {
      length: 0
    },
    success: true
  },
  filter: {}
};

export const NO_SELECTION = [];
export const getSelection = ({ state, windowType, viewId }) => {
  const windowTypeSelections = state.windowHandler.selections[windowType];

  return (windowTypeSelections && windowTypeSelections[viewId]) || NO_SELECTION;
};

export default function windowHandler(state = initialState, action) {
  switch (action.type) {
    case NO_CONNECTION:
      return Object.assign({}, state, {
        connectionError: action.status
      });

    case OPEN_MODAL:
      return Object.assign({}, state, {
        modal: Object.assign({}, state.modal, {
          visible: true,
          type: action.windowType,
          dataId: action.dataId,
          tabId: action.tabId,
          rowId: action.rowId,
          viewId: action.viewId,
          title: action.title,
          modalType: action.modalType,
          isAdvanced: action.isAdvanced,
          viewDocumentIds: action.viewDocumentIds,
          triggerField: action.triggerField,
          parentViewId: action.parentViewId,
          parentViewSelectedIds: action.parentViewSelectedIds,
          childViewId: action.childViewId,
          childViewSelectedIds: action.childViewSelectedIds
        })
      });

    case UPDATE_MODAL:
      return Object.assign({}, state, {
        modal: Object.assign({}, state.modal, {
          rowId: action.rowId,
          dataId: action.dataId
        })
      });

    case CLOSE_PROCESS_MODAL:
      if (state.modal.modalType === "process") {
        return Object.assign({}, state, {
          modal: Object.assign({}, state.modal, initialState.modal)
        });
      }
      return state;

    case CLOSE_MODAL:
      return Object.assign({}, state, {
        modal: Object.assign({}, state.modal, initialState.modal)
      });

    // SCOPED ACTIONS

    case INIT_LAYOUT_SUCCESS:
      return Object.assign({}, state, {
        [action.scope]: Object.assign({}, state[action.scope], {
          layout: action.layout
        })
      });

    case INIT_DATA_SUCCESS:
      return Object.assign({}, state, {
        [action.scope]: Object.assign({}, state[action.scope], {
          data: action.data,
          docId: action.docId,
          layout: {},
          rowData: {},
          saveStatus: action.saveStatus,
          standardActions: new Set(action.standardActions),
          validStatus: action.validStatus,
          includedTabsInfo: action.includedTabsInfo,
          websocket: action.websocket
        })
      });

    case CLEAR_MASTER_DATA:
      return Object.assign({}, state, {
        master: Object.assign({}, state.master, {
          data: {},
          rowData: {},
          docId: undefined
        })
      });

    case SORT_TAB:
      return Object.assign({}, state, {
        [action.scope]: Object.assign({}, state[action.scope], {
          layout: Object.assign({}, state[action.scope].layout, {
            tabs: state[action.scope].layout.tabs.map(
              tab =>
                tab.tabId === action.tabId
                  ? Object.assign({}, tab, {
                      orderBy: [
                        {
                          fieldName: action.field,
                          ascending: action.asc
                        }
                      ]
                    })
                  : tab
            )
          })
        })
      });

    case ACTIVATE_TAB:
      return update(state, {
        [action.scope]: {
          layout: {
            activeTab: { $set: action.tabId }
          }
        }
      });

    case UNSELECT_TAB:
      return update(state, {
        [action.scope]: {
          layout: {
            activeTab: { $set: null }
          }
        }
      });

    case ADD_ROW_DATA:
      return Object.assign({}, state, {
        [action.scope]: Object.assign({}, state[action.scope], {
          rowData: Object.assign({}, state[action.scope].rowData, action.data)
        })
      });

    case ADD_NEW_ROW:
      return update(state, {
        [action.scope]: {
          rowData: {
            [action.tabid]: {
              $push: [action.item]
            }
          }
        }
      });

    case DELETE_ROW:
      return update(state, {
        [action.scope]: {
          rowData: {
            [action.tabid]: {
              $set: state[action.scope].rowData[action.tabid].filter(
                item => item.rowId !== action.rowid
              )
            }
          }
        }
      });

    case UPDATE_DATA_FIELD_PROPERTY:
      return update(state, {
        [action.scope]: {
          data: {
            [action.property]: {
              $set: Object.assign(
                {},
                state[action.scope].data[action.property],
                action.item
              )
            }
          }
        }
      });

    case UPDATE_DATA_PROPERTY: {
      let value;

      if (typeof action.value === "string") {
        value = action.value;
      } else if (action.property === "standardActions") {
        // TODO: Evaluate if standardActions of type Set
        // is worth this extra check
        value = new Set(action.value);
      } else {
        value = Object.assign(
          {},
          state[action.scope] ? state[action.scope][action.property] : {},
          action.value
        );
      }

      return update(state, {
        [action.scope]: {
          [action.property]: {
            $set: value
          }
        }
      });
    }

    case UPDATE_ROW_FIELD_PROPERTY: {
      const scope = action.scope;
      const tabid = action.tabid;
      const rowid = action.rowid;
      const property = action.property;
      const scState = state[scope];

      if (scState && scState.rowData && scState.rowData[tabid]) {
        const scRowData = scState.rowData[tabid];

        return update(state, {
          [action.scope]: {
            rowData: {
              [tabid]: {
                $set: scRowData.map(
                  (item, index) =>
                    item.rowId === rowid
                      ? {
                          ...scRowData[index],

                          fieldsByName: {
                            ...scRowData[index].fieldsByName,

                            [property]: {
                              ...scRowData[index].fieldsByName[property],
                              ...action.item
                            }
                          }
                        }
                      : item
                )
              }
            }
          }
        });
      } else {
        return state;
      }
    }

    case UPDATE_ROW_PROPERTY:
      return update(state, {
        [action.scope]: {
          rowData: {
            [action.tabid]: {
              $set: state[action.scope].rowData[action.tabid].map(
                (item, index) =>
                  item.rowId === action.rowid
                    ? {
                        ...state[action.scope].rowData[action.tabid][index],
                        [action.property]: action.item
                      }
                    : item
              )
            }
          }
        }
      });

    case UPDATE_ROW_STATUS:
      return update(state, {
        [action.scope]: {
          rowData: {
            [action.tabid]: {
              $set: state[action.scope].rowData[action.tabid].map(
                item =>
                  item.rowId === action.rowid
                    ? { $set: action.saveStatus }
                    : item
              )
            }
          }
        }
      });

    case UPDATE_DATA_VALID_STATUS:
      return Object.assign({}, state, {
        [action.scope]: Object.assign({}, state[action.scope], {
          validStatus: action.validStatus
        })
      });

    case UPDATE_DATA_SAVE_STATUS:
      return Object.assign({}, state, {
        [action.scope]: Object.assign({}, state[action.scope], {
          saveStatus: action.saveStatus
        })
      });

    case UPDATE_DATA_INCLUDED_TABS_INFO:
      return Object.assign({}, state, {
        [action.scope]: Object.assign({}, state[action.scope], {
          includedTabsInfo: Object.keys(
            state[action.scope].includedTabsInfo
          ).reduce((result, current) => {
            result[current] = Object.assign(
              {},
              state[action.scope].includedTabsInfo[current],
              action.includedTabsInfo[current]
                ? action.includedTabsInfo[current]
                : {}
            );
            return result;
          }, {})
        })
      });
    // END OF SCOPED ACTIONS

    // INDICATOR ACTIONS
    case CHANGE_INDICATOR_STATE:
      return Object.assign({}, state, {
        indicator: action.state
      });

    // END OF INDICATOR ACTIONS

    case SELECT_TABLE_ITEMS: {
      const { windowType, viewId, ids } = action.payload;

      return {
        ...state,

        selections: {
          ...state.selections,

          [windowType]: {
            ...state.selections[windowType],

            [viewId]: ids
          }
        }
      };
    }

    // LATEST NEW DOCUMENT CACHE
    case SET_LATEST_NEW_DOCUMENT:
      return Object.assign({}, state, {
        latestNewDocument: action.id
      });

    // RAW Modal
    case CLOSE_RAW_MODAL:
      return Object.assign({}, state, {
        rawModal: Object.assign({}, state.rawModal, {
          visible: false,
          type: null,
          viewId: null
        })
      });

    case OPEN_RAW_MODAL:
      return Object.assign({}, state, {
        rawModal: Object.assign({}, state.rawModal, {
          visible: true,
          type: action.windowType,
          viewId: action.viewId
        })
      });

    case OPEN_FILTER_BOX:
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {
          visible: true,
          boundingRect: action.boundingRect
        })
      });

    case CLOSE_FILTER_BOX:
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {
          visible: false,
          boundingRect: null
        })
      });
    case ALLOW_OUTSIDE_CLICK:
      return {
        ...state,
        allowOutsideClick: true
      };

    case DISABLE_OUTSIDE_CLICK:
      return {
        ...state,
        allowOutsideClick: false
      };

    case ALLOW_SHORTCUT:
      return {
        ...state,
        allowShortcut: true
      };

    case DISABLE_SHORTCUT:
      return {
        ...state,
        allowShortcut: false
      };

    case PATCH_REQUEST:
      return {
        ...state,
        patches: {
          ...state.patches,
          requests: {
            ...state.patches.requests,
            [action.symbol]: action.options,
            length: state.patches.requests.length + 1
          }
        }
      };

    case PATCH_SUCCESS: {
      const requests = { ...state.patches.requests };

      if (!requests[action.symbol]) {
        return state;
      }

      delete requests[action.symbol];
      requests.length = requests.length - 1;

      return {
        ...state,
        patches: {
          ...state.patches,
          requests
        }
      };
    }

    case PATCH_FAILURE: {
      const requests = { ...state.patches.requests };

      if (!requests[action.symbol]) {
        return state;
      }

      delete requests[action.symbol];
      requests.length = requests.length - 1;

      return {
        ...state,
        patches: {
          ...state.patches,
          requests,
          success: false
        }
      };
    }

    case PATCH_RESET:
      return {
        ...state,
        patches: {
          ...state.patches,
          requests: {
            length: 0
          },
          success: true
        }
      };

    default:
      return state;
  }
}
