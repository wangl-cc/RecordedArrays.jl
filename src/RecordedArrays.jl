module RecordedArrays

using RecipesBase

export DiscreteClock, ContinuousClock, now, limit, start, init!, increase!
export DynamicRArray, StaticRArray, state, setclock
export LinearSearch, BinarySearch, records, rarray, tspan, ts, vs, toseries, gettime, unione

include("clock.jl")

include("abstract.jl")

include("record/records.jl")

include("record/interface.jl")

include("math.jl")

include("dynamic/scalar.jl")

include("dynamic/vector.jl")

include("static/vector.jl")

end
# vim:tw=92:ts=4:sw=4:et
