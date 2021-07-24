mutable struct Size{N}
    sz::NTuple{N,Int}
end
@inline Size(is::Int...) = Size(is)
@inline Size(A::AbstractArray) = Size(size(A))

Base.length(::Size{N}) where {N} = N
Base.convert(::Type{T}, sz::Size) where {T<:Tuple} = convert(T, sz.sz)

# The below two methods is a modifaction of `MArray` in `StaticArrays.jl`
# https://github.com/JuliaArrays/StaticArrays.jl/blob/master/src/MArray.jl#L80
function Base.getindex(sz::Size{N}, i::Integer) where {N}
    @boundscheck 1 <= i <= N || throw(BoundsError(sz, i))
    return GC.@preserve sz unsafe_load(Base.unsafe_convert(Ptr{Int}, pointer_from_objref(sz)), i)
end

function Base.setindex!(sz::Size{N}, v, i::Integer) where {N}
    @boundscheck 1 <= i <= N || throw(BoundsError(sz, i))
    return GC.@preserve sz unsafe_store!(Base.unsafe_convert(Ptr{Int}, pointer_from_objref(sz)), convert(Int, v), i)
end

struct IndexMap{N} <: AbstractArray{Int,N}
    Is::NTuple{N,Vector{Int}}
end
IndexMap(axes::NTuple{N,AbstractVector{Int}}) where {N} = IndexMap(map(collect, axes))
IndexMap(sz::NTuple{N,Int}) where {N} = IndexMap(map(Base.oneto, sz))
IndexMap(sz::Size{N}) where {N} = IndexMap(sz.sz)

Base.size(indmap::IndexMap) = map(length, indmap.Is)

function Base.getindex(indmap::IndexMap{N}, I::Vararg{Int,N}) where {N}
    @boundscheck checkbounds(indmap, I...)
    return map(getindex, indmap.Is, I)
end

function checksize(::Type{Bool}, sz::Tuple, As::AbstractArray...)
    for A in As
        sz == size(A) || return false
    end
    return true
end
@inline checksize(::Type{Bool}, sz::Size, As::AbstractArray...) =
    checksize(Bool, sz.sz, As...)
@inline checksize(::Type{Bool}, A::AbstractArray, As::AbstractArray...) =
    checksize(Bool, size(A), As...)
checksize(As...) = checksize(Bool, As...) ||
    throw(ArgumentError("length of args mismatch"))