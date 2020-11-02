import React from "react";

import * as R from "ramda";

import {useSelector} from "react-redux";

import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Rating from "@material-ui/lab/Rating";
import Tooltip from "@material-ui/core/Tooltip";

import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import AppPage from "../../components/AppPage/AppPage";
import {DefaultFormFieldFactory, UrlField} from "@intellective/core";

export default {title: "Examples/Form Field"};

/*
 * Custom Form Field Adornment
*/
const withCustomFieldAdornment = R.curry((formId, WrappedField, props) => {

    const {id, value: url, InputProps = {}} = props;

    const formSelector = useSelector(({forms}) => (forms[formId]));

    const formState = (formSelector && formSelector.data) || {};

    const invalid = R.defaultTo(false)(R.path([id, "invalid"], formState));

    const onClickHandler = () => {
        window.open(url, "_blank");
    };

    const endAdornment = url && !invalid && (
        <InputAdornment position="end">
            <Tooltip title="Open in a new browser tab" role="tooltip">
                <IconButton size="small"
                            role="button"
                            aria-label="Open"
                            onClick={onClickHandler}>
                    <OpenInNewIcon/>
                </IconButton>
            </Tooltip>
        </InputAdornment>
    );

    return <WrappedField {...props} InputProps={{...InputProps, endAdornment}}/>;
});

const UsersUrlFieldFactory = (props) => {
    const {formId} = props;

    return withCustomFieldAdornment(formId, UrlField);
};

export const UsingFormFieldAdornment = () => {

    const DomainFieldMapper = R.cond([
        [R.propEq("ui", "usersUrl"), UsersUrlFieldFactory],
    ]);

    const DomainFormFieldFactory = (props) => DomainFieldMapper(props) || DefaultFormFieldFactory(props);

    return <AppPage href="/api/1.0.0/config/perspectives/search/dashboards/page12"
                    FormFieldFactory={DomainFormFieldFactory}/>;
}

/*
 * Custom Form Field
*/
const RatingField = props => {

    const {id, label, margin = "dense", value, onChange} = props;

    const handleChange = (event, newValue) => {
        onChange && onChange(newValue);
    };

    return (
        <FormControl margin={margin} fullWidth component="div">
            <FormLabel component="label">{label}</FormLabel>

            <Rating name={id} value={value} onChange={handleChange}/>
        </FormControl>
    );
};

export const UsingCustomFormField = () => {

    const DomainFormFieldFactory = (props) => R.ifElse(
        R.propEq("ui", "rating"),
        R.always(RatingField),
        DefaultFormFieldFactory
    )(props);

    return <AppPage href="/api/1.0.0/config/perspectives/search/dashboards/page12"
                    FormFieldFactory={DomainFormFieldFactory}/>;
}
