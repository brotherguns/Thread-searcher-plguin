var currentQuery = "";
var _screenCb = null;
var _rowCb = null;

function SearchBar(props) {
    var React = bunny.metro.common.React;
    var state = React.useState(currentQuery);
    var query = state[0];
    var setQuery = state[1];

    React.useEffect(function() {
        setQuery(currentQuery);
    }, []);

    function handleChange(q) {
        currentQuery = q;
        setQuery(q);
        if (props.onChange) props.onChange(q);
    }

    var TextInput = bunny.metro.common.components.TextInput;
    var View = bunny.metro.findByProps("View", "Text", "AppRegistry").View;

    return React.createElement(
        View,
        { style: { paddingHorizontal: 16, paddingVertical: 8 } },
        React.createElement(TextInput, {
            grow: true,
            isClearable: true,
            placeholder: "Search threads...",
            onChange: handleChange,
            returnKeyType: "search",
            size: "md",
            autoCapitalize: "none",
            autoCorrect: false,
            isRound: true,
            value: query
        })
    );
}

function ThreadsScreenWrapper(props) {
    var React = bunny.metro.common.React;
    var state = React.useState(currentQuery);
    var setQuery = state[1];

    function handleChange(q) {
        currentQuery = q;
        setQuery(q);
    }

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(SearchBar, { onChange: handleChange }),
        props.originalElement
    );
}

var plugin = definePlugin({
    start: function() {
        _screenCb = function(comp, ret) {
            var React = bunny.metro.common.React;
            return React.createElement(ThreadsScreenWrapper, { originalElement: ret });
        };

        _rowCb = function(comp, ret) {
            if (!currentQuery) return ret;
            var thread = ret && ret.props && ret.props.thread;
            if (!thread) return ret;
            var name = thread.name || "";
            if (name.toLowerCase().indexOf(currentQuery.toLowerCase()) === -1) {
                return null;
            }
            return ret;
        };

        bunny.api.react.jsx.onJsxCreate("ThreadsScreen", _screenCb);
        bunny.api.react.jsx.onJsxCreate("ThreadListTableRow", _rowCb);
    },

    stop: function() {
        if (_screenCb) bunny.api.react.jsx.deleteJsxCreate("ThreadsScreen", _screenCb);
        if (_rowCb) bunny.api.react.jsx.deleteJsxCreate("ThreadListTableRow", _rowCb);
        currentQuery = "";
        _screenCb = null;
        _rowCb = null;
    }
});
