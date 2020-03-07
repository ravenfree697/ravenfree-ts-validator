
export default class ModelValidator<V> {

    private model: V;
    private isValidStatus: boolean;
    private errorMessage?: string

    constructor(model: V) {
        this.model = model
        this.isValidStatus = true
        this.errorMessage = 'No Error'
    }

    /** Set new error message */
    private setErrorMessage = (message: string) => {
        if (this.isModelInvalid())
            this.errorMessage = message
    }

    /** Set validation status to false */
    private setInvalidStatus = () => this.isValidStatus = false

    /** Check, if the validation status is false */
    private isModelInvalid = () => this.isValidStatus === false

    // RESULT METHODS

    /** Return final validation status */
    tellMeValidationStatus = () => { return { status: this.isValidStatus } }

    /** Return error message of the first error kind */
    whereIsTheProblem = () => this.errorMessage

    // SIMPLE CHECK METHODS

    /** Check, if the value is not null */
    isNotNull = (selector: (model: V) => any) => {
        if (this.isModelInvalid())
            return this

        const selectResult = selector(this.model)
        this.isValidStatus = selectResult !== null

        this.setErrorMessage(`Validation Error: ${selectResult} is NULL`)
        return this
    }

    /** Check, if the value is not undefined */
    isNotUndefined = (selector: (model: V) => any) => {
        if (this.isModelInvalid())
            return this

        const selectResult = selector(this.model)
        this.isValidStatus = selectResult !== undefined

        this.setErrorMessage(`Validation Error: ${selectResult} is UNDEFINED`)
        return this
    }

    /** Check, if the value is not empty */
    isNotEmpty = (selector: (model: V) => String) => {
        if (this.isModelInvalid())
            return this

        const selectResult = selector(this.model)
        this.isValidStatus = selectResult !== ''

        this.setErrorMessage(`Validation Error: ${selectResult} is EMPTY`)
        return this
    }

    /** Check, if the value is not null or undefined or empty  */
    isNotUndefinedOrNullOrEmpty = (selector: (model: V) => any) => {
        if (this.isModelInvalid())
            return this

        const selectResult = selector(this.model)
        this.isValidStatus = (selectResult !== undefined) && (selectResult !== null) && (selectResult !== '')

        this.setErrorMessage(`Validation Error: ${selectResult} is UNDEFINED or NULL or EMPTY`)

        return this
    }

    /** Check, if the value is not null or undefined  */
    isNotUndefinedOrNull = (selector: (model: V) => any) => {
        if (this.isModelInvalid())
            return this

        const selectResult = selector(this.model)
        this.isValidStatus = (selectResult !== undefined) && (selectResult !== null)

        this.setErrorMessage(`Validation Error: ${selectResult} is UNDEFINED or NULL`)

        return this
    }

    /**  String max/min length validation */
    stringLenght = (selector: (model: V) => String, status: 'MAX' | 'MIN', value: Number) => {
        if (this.isModelInvalid())
            return this

        const selectResult = selector(this.model)

        if (status === 'MAX')
            this.isValidStatus = selectResult.length <= value
        else if (status === 'MIN')
            this.isValidStatus = selectResult.length >= value

        this.setErrorMessage(`Validation Error: ${selectResult} is out of length ${status} ${value} characters`)

        return this
    }

    /** String length range validation (from bottom to top level) */
    stringRange = (selector: (model: V) => String, topLevel: Number, bottomLevel: Number) => {
        if (this.isModelInvalid())
            return this

        const selectResult = selector(this.model)

        this.isValidStatus = (selectResult.length > bottomLevel) && (selectResult.length < topLevel)
        

        this.setErrorMessage(`Validation Error: ${selectResult} is out of range from ${bottomLevel} to ${topLevel}`)

        return this
    }

    /** Compare number value against reference number value (smaller than or larger than) */
    numberCompare = (selector: (model: V) => number, condition: 'Smaller than' | 'Larger than', value: number) => {
        if (this.isModelInvalid())
            return this

        const selectResult = selector(this.model)
        const isHigherCondition = condition === 'Larger than'
        this.isValidStatus = isHigherCondition ? selectResult > value : selectResult < value

        this.setErrorMessage(`Validation Error: ${selectResult} is ${(() => isHigherCondition ? 'smaller' : 'larger')()} than ${value}`)
        return this
    }

    /** Check, if the value is number, or not */
    isNumber = (selector: (model: V) => any, request: 'isNumber' | 'isNotNumber') => {

        if (this.isModelInvalid())
            return this
        const value = selector(this.model)
        const itIsNotNumber = Number(value) === NaN
        if (request === 'isNumber' && itIsNotNumber) {
            this.setInvalidStatus()
            this.setErrorMessage(`Value ${value} is not numeric, but it should be.`)
        }
        else if (request === 'isNotNumber' && !itIsNotNumber) {
            this.setInvalidStatus()
            this.setErrorMessage(`Value ${value} is numeric, but should not.`)
        }

        return this
    }

    //Check boolean validity 
    isTrueOrFalse = (selector: (model: V) => boolean, statement: 'Should be True' | 'Should be False', PropertyKeyName = 'Unset key name') => {
        if (this.isModelInvalid())
            return this

        const value = selector(this.model)
        if (statement === 'Should be True' && value === false) {
            this.setInvalidStatus()
            this.setErrorMessage(`${PropertyKeyName} model value should be True, but is is False.`)
        }

        else if (statement === 'Should be False' && value === true) {
            this.setInvalidStatus()
            this.setErrorMessage(`${PropertyKeyName} model value should be False, but is is True.`)
        }

        return this
    }

    //CHECK SEQUENCE
    /**Check multiple model parameters, if any of them is undefined or null */
    isNotUndefinedOrNullSequence = (sequence: { (model: V): any }[]) => {
        for (let i = 0; i < sequence.length; i++) {
            this.isNotUndefinedOrNull(sequence[i])
        }
        return this
    }

    /**Check multiple model parameters, if any of them is undefined or null */
    isNotUndefinedOrNullOrEmptySequence = (sequence: { (model: V): String }[]) => {
        for (let i = 0; i < sequence.length; i++) {
            this.isNotUndefinedOrNullOrEmpty(sequence[i])
        }
        return this
    }

    /**Check multiple model parameters, if any of them is undefined */
    isNotUndefinedSequence = (sequence: { (model: V): any }[]) => {
        for (let i = 0; i < sequence.length; i++) {
            this.isNotUndefined(sequence[i])
        }
        return this
    }

    /**Check multiple model parameters, if any of them is null */
    isNotNullSequence = (sequence: { (model: V): any }[]) => {
        for (let i = 0; i < sequence.length; i++) {
            this.isNotNull(sequence[i])
        }
        return this
    }

    /**Sequence for multiple string length check */
    multipleStringInRangeSequence = (sequence: { (model: V): any }[], bottomLevel: Number, topLevel: Number) => {
        for (let i = 0; i < sequence.length; i++) {
            this.stringRange(sequence[i], topLevel, bottomLevel)
        }
        return this
    }

    /** Sequence for check true/false value at multiple booleans */
    booleanSequence = (sequence: { (model: V): boolean }[], statement: 'Should be True' | 'Should be False') => {
        for (let i = 0; i < sequence.length; i++) {
            this.isTrueOrFalse(sequence[i], statement)
        }
        return this
    }

    /** Check, if multiple numbers are actually numbers */
    isNumberSequence = (sequence: { (model: V): any }[], request: "isNumber" | "isNotNumber") => {
        for (let i = 0; i < sequence.length; i++) {
            this.isNumber(sequence[i], request)
        }
        return this
    }
}