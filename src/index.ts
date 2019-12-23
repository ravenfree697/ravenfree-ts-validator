
export default class ModelValidator<V> {

    private model: V;
    private isValidStatus: boolean;
    private errorMessage?: string

    constructor(model: V) {
        this.model = model
        this.isValidStatus = true
        this.errorMessage = 'No Error'
    }

    private setErrorMessage = (message: string) => {
        if (this.modelIsUnvalid())
            this.errorMessage = message
    }

    private setInvalidStatus = () => this.isValidStatus = false

    private modelIsUnvalid = () => this.isValidStatus === false

    /** Return final validation status */
    tellMeValidationStatus = () => { return { status: this.isValidStatus } }

    /** Return error message of the first error kind */
    whereIsTheProblem = () => this.errorMessage

    /** Check, if the value is not null */
    isNotNull = (selector: (model: V) => any) => {
        if (this.modelIsUnvalid())
            return this

        const selectResult = selector(this.model)
        this.isValidStatus = selectResult !== null

        this.setErrorMessage(`Validation Error: ${selectResult} is NULL`)
        return this
    }


    /** Check, if the value is not undefined */
    isNotUndefined = (selector: (model: V) => any) => {
        if (this.modelIsUnvalid())
            return this

        const selectResult = selector(this.model)
        this.isValidStatus = selectResult !== undefined

        this.setErrorMessage(`Validation Error: ${selectResult} is UNDEFINED`)
        return this
    }

    /** Chack, if the value is not null or undefined  */
    isNotUndefinedOrNull = (selector: (model: V) => any) => {
        if (this.modelIsUnvalid())
            return this

        const selectResult = selector(this.model)
        this.isValidStatus = (selectResult !== undefined) && (selectResult !== null)

        this.setErrorMessage(`Validation Error: ${selectResult} is UNDEFINED or NULL`)

        return this
    }

    /** Compare number value against reference number value (smaller than or larger than) */
    numberCompare = (selector: (model: V) => number, condition: 'Smaller than' | 'Larger than', value: number) => {
        if (this.modelIsUnvalid())
            return this

        const selectResult = selector(this.model)
        const isHigherCondition = condition === 'Larger than'
        this.isValidStatus = isHigherCondition ? selectResult > value : selectResult < value

        this.setErrorMessage(`Validation Error: ${selectResult} is ${(() => isHigherCondition ? 'smaller' : 'larger')()} than ${value}`)
        return this
    }

    /**Check multiple model parameters, if any of them is undefined or null */
    isNotUndefinedOrNullSequence = (sequence: { (model: V): any }[]) => {
        for (let i = 0; i < sequence.length; i++) {
            this.isNotUndefinedOrNull(sequence[i])
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

    /** Check, if the value is number, or not */
    isNumber = (value: any, request: 'isNumber' | 'isNotNumber') => {

        if (this.modelIsUnvalid())
            return this

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

    isTrueOrFalse = (value: boolean, statement: 'Should be True' | 'Should be False', PropertyKeyName = 'Unset key name') => {
        if (this.modelIsUnvalid())
            return this

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
}