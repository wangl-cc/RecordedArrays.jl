"""
    AbstractClock{T<:Real}

Supertype of clocks with time of type `T`. Clocks are used to record changes of time.
A clock can be iterate by `for` loop and break when reach to stop.
"""
abstract type AbstractClock{T<:Real} end

"""
    now(c::AbstractClock)

Return current time of clock `c`.
"""
function now end

"""
    limit(c::AbstractClock)

Return the limit of clock `c`. For a ContinuousClock `c`,
the max time might larger than `limit(c)`.
"""
function limit end

"""
    init!(c::AbstractClock)

Update current time to start time.
"""
function init! end

"""
    DiscreteClock{T, I<:AbstractVector{T}} <: AbstractClock{T}
    DiscreteClock([start], indexset)
    DiscreteClock(stop)

A clock for discrete-time process, it's `indexset` must be a non-empty `AbstractVector`.  If
the `start` is not specified, the first item of indexset will be poped and set as `start`.
During iteration, the current time will be updated automatically and returned as iteration
item. When the iteration finnished without `break`, [`init!(c)`](@ref init!) wil be applied.
`DiscreteClock(stop)` will create a clock with `start=0` and `indexset=Base.OneTo(stop)`

Examples
≡≡≡≡≡≡≡≡≡≡
```jldoctest
julia> c = DiscreteClock(0:3);

julia> now(c)
0

julia> [(t, now(c)) for t in c]
3-element Vector{Tuple{Int64, Int64}}:
 (1, 1)
 (2, 2)
 (3, 3)

julia> now(c)
0

julia> c = DiscreteClock(3); # similar to DiscreteClock(0:3)

julia> (now(c), collect(c))
(0, [1, 2, 3])
```
"""
struct DiscreteClock{T,I<:AbstractVector{T}} <: AbstractClock{T}
    current::State{T}
    start::T
    indexset::I
    function DiscreteClock(start::T, indexset::I) where {T,I<:AbstractVector{T}}
        return new{T,I}(State(start), start, indexset)
    end
end
function DiscreteClock(indexset::AbstractVector)
    isempty(indexset) && throw(ArgumentError("indexset must contain at least one element"))
    return DiscreteClock(indexset[1], indexset[2:end])
end
function DiscreteClock(stop::Integer)
    stop > 0 || throw(ArgumentError("stop time must be > 0"))
    return DiscreteClock(zero(stop), Base.OneTo(stop))
end

# iterator interfaces
Base.IteratorSize(::Type{<:DiscreteClock}) = Base.HasLength()
Base.length(c::DiscreteClock) = length(c.indexset)
Base.eltype(::Type{<:DiscreteClock{T}}) where {T} = T
Base.iterate(c::DiscreteClock) = _itr_update!(c, iterate(c.indexset))
function Base.iterate(c::DiscreteClock, state)
    return _itr_update!(c, iterate(c.indexset, state))
end
_itr_update!(c::DiscreteClock, ::Nothing) = (init!(c); nothing)
function _itr_update!(c::DiscreteClock{T,I}, ret::Tuple{T,Any}) where {T,I}
    update!(c.current, ret[1])
    return ret
end

# clock interfaces
now(c::DiscreteClock) = value(c.current)
limit(c::DiscreteClock) = last(c.indexset)
init!(c::DiscreteClock) = update!(c.current, c.start)

"""
    ContinuousClock{T, I<:Union{Nothing, DiscreteClock}} <: AbstractClock{T}
    ContinuousClock(stop, [start=zero(stop)]; [max_epoch=nothing])

A clock for continuous-time process. Unlike the [`DiscreteClock`](@ref DiscreteClock),
during iteration, the current time will not be update automatically, but update by
[`increase!`](@ref increase!) manually. Besides the epoch of current iteration instead of
current time will be returned. If the `max_epoch` is specified, the iteration will break
when epoch reach to the `max_epoch`, even `now(c) < limit(c)`, and break in this way the
[`init!(c)`](@ref init!) will not be applied.

Examples
≡≡≡≡≡≡≡≡≡≡
```jldoctest
julia> c = ContinuousClock(3.0; max_epoch=2);

julia> for epoch in c
           increase!(c, 1)
           println(now(c), '\t', epoch)
       end
1.0	1
2.0	2

julia> for epoch in c
           increase!(c, 1)
           println(now(c), '\t', epoch)
       end
3.0	1

julia> for epoch in c
           increase!(c, 1)
           println(now(c), '\t', epoch)
       end
1.0	1
2.0	2
```
"""
struct ContinuousClock{T,I<:Union{Nothing,Integer}} <: AbstractClock{T}
    current::State{T}
    start::T
    stop::T
    epoch::I
    function ContinuousClock(
        start::T,
        stop::T,
        epoch::I,
    ) where {T<:Real,I<:Union{Nothing,Integer}}
        start > stop && throw(ArgumentError("stop must be larger than start"))
        return new{T,I}(State(start), start, stop, epoch)
    end
end
function ContinuousClock(
    stop::Real,
    start::Real = zero(stop);
    max_epoch::Union{Nothing,Integer} = nothing,
)
    return ContinuousClock(promote(start, stop)..., max_epoch)
end

# iterator interfaces
Base.IteratorSize(::Type{<:ContinuousClock}) = Base.SizeUnknown()
Base.eltype(::ContinuousClock{T}) where {T} = T
Base.iterate(c::ContinuousClock) = now(c) < limit(c) ? _itr(c.epoch) : (init!(c); nothing)
Base.iterate(c::ContinuousClock, state) =
    now(c) < limit(c) ? _itr(c.epoch, state) : (init!(c); nothing)

_itr(::Nothing, i::Int = 1) = (i, i + 1)
_itr(lim::Integer, i::Integer = one(lim)) = ifelse(i > lim, nothing, (i, i + 1))

# clock interfaces
now(c::ContinuousClock) = value(c.current)
limit(c::ContinuousClock) = c.stop
init!(c::ContinuousClock) = update!(c.current, c.start)

"""
    increase!(c::ContinuousClock, t::Real)

Update current time of clock `c` to `now(c) + t`.
"""
increase!(c::ContinuousClock, t::Real) = plus!(c.current, t)

# vim:tw=92:ts=4:sw=4:et